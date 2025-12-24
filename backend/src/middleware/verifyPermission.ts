import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";


export const verifyPermission = (name: string, access: string) => async (req: Request, res: Response, next: NextFunction) => {

    const { id,role } = req.user;
    const findPermissionType = await prisma.permissionType.findFirst({
        where: {
            name: name
        }
    });
    if(!findPermissionType){
        return res.status(401).send({
            success: false,
            message: "Access Denied Not found Permission Type"
        });
    }
    const findPermission = await prisma.permission.findFirst({
        where: {
            name: access,
            permissionTypeId: findPermissionType.id
        }
    });

    if (findPermission) {
        const findUserPermission = await prisma.userPermission.findFirst({
            where: {
                userId: id,
                permissionId: findPermission?.id
            }
        });
        const findRolePermission = await prisma.rolePermission.findFirst({
            where: {
                role,
                permissionId: findPermission?.id
            }
        });

        if (findUserPermission || findRolePermission) {
            next(); // User has the required permission, proceed to the next middleware
        } else {
            return res.status(401).send({
                success: false,
                message: "Access Denied Unauthorized Permission"
            });
        }
    } else {
        return res.status(401).send({
            success: false,
            message: "Access Denied Unauthorized Permission"
        });
    }
};








