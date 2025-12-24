import { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

// create BlogCategory variation
export const createBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const findBlogCategory = await prisma.blogCategory.findFirst({
      where: {
        name: req.body.name,
      }
    })
    if (findBlogCategory) {
      return res.status(400).send({
        success: false,
        message: "Blog Category Already Exist"
      })
    }

    // Create BlogCategory
    const result = await prisma.blogCategory.create({
      data: {name:req.body.name,},
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Blog Category Created Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getBlogCategoryAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, size, sortOrder, search } = req.query;
    let skip = parseInt(page as string) - 1 || 0;
    const take = parseInt(size as string) || 10;
    const order =
      (sortOrder as string)?.toLowerCase() === "desc" ? "desc" : "asc";

    const whereBlogCategory: Prisma.BlogCategoryWhereInput[] = [];
    if (skip < 0) {
      skip = 0;
    }
    if (search) {
      whereBlogCategory.push({
        OR: [{ name: { contains: search as string } }],
      });
    }

    const result = await prisma.blogCategory.findMany({
      where: {
        AND: whereBlogCategory,
      },
        skip: skip * take,
        take,
        orderBy:{
          name: "asc"
        }
    });
    const total = await prisma.blogCategory.count()

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog Category  retrieved successfully",
      meta: {
        page: skip,
        size: take,
        total,
        totalPage: Math.ceil(total / take)
      },
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get BlogCategory by id
export const getBlogCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const BlogCategoryId = Number(req.params.id);

    if (isNaN(BlogCategoryId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid Blog Category id",
      });
    }

    const result = await prisma.blogCategory.findUnique({
      where: {
        id: BlogCategoryId,
      },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Blog Category not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog Category retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// update BlogCategory
export const updateBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const BlogCategoryId = Number(req.params.id);
    const { ...data } = req.body;
    if (isNaN(BlogCategoryId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid BlogCategory  id",
      });
    }

    const existingBlogCategory = await prisma.blogCategory.findUnique({
      where: {
        id: BlogCategoryId,
      },
    });

    if (!existingBlogCategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "BlogCategory  not found",
      });
    }

    const result = await prisma.blogCategory.update({
      where: {
        id: BlogCategoryId,
      },
      data: {...data},
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog Category updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// delete BlogCategory Product
export const deleteBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const BlogCategoryId = Number(req.params.id);
    if (isNaN(BlogCategoryId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid Blog Category id",
      });
    }

    const existingBlogCategory = await prisma.blogCategory.findUnique({
      where: {
        id: BlogCategoryId,
      },
    });

    if (!existingBlogCategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Blog Category not found",
      });
    }

    const result = await prisma.blogCategory.delete({
      where: {
        id: BlogCategoryId,
      },
    });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog Category deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
