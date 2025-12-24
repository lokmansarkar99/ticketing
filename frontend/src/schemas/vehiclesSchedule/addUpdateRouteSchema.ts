import { z } from "zod";

export const addUpdateRouteSchema = z.object({
  routeType: z
    .enum(["Local", "International"], {
      required_error: "Route type is required",
    })
    .optional(),

  routeDirection: z
    .enum(["Up_Way", "Down_Way"], {
      required_error: "Route direction is required",
    })
    .optional(),

  kilo: z
    .number({
      invalid_type_error: "Distance must be a number",
    })
    .optional(),

  isPassengerInfoRequired: z
    .boolean({
      invalid_type_error: "Passenger information permission must be a boolean",
    })
    .optional(),

  via: z
    .string({
      required_error: "Via is required",
      invalid_type_error: "Via must be a string",
    })
    .optional(),

  from: z
    .number({
      required_error: "Route starting point is required",
      invalid_type_error: "Route starting point must be a number",
    })
    .min(1, "Route starting point is required"),
    middle: z
    .preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number({
        invalid_type_error: "Route middle point must be a number",
      })
      .optional()
    )
    .optional(),

  to: z
    .number({
      required_error: "Route ending point is required",
      invalid_type_error: "Route ending point must be a number",
    })
    .min(1, "Route ending point is required"),

  routeName: z
    .string({
      required_error: "Route name is required",
      invalid_type_error: "Route name must be a string",
    })
    .min(1, "Route name is required"),

  viaStations: z
    .array(z.number(), {
      required_error: "Station is required",
      invalid_type_error: "Station must be an array of numbers",
    })
    .min(1, "Station is required"),

  // segments: z
  //   .array(
  //     z.object({
  //       id:z.number({required_error:"Id is required"}),
  //       type: z.enum(["AC", "NON AC"], {
  //         required_error: "Segment type is required",
  //       }),
  //       fromStationId: z.number({
  //         required_error: "From station ID is required",
  //         invalid_type_error: "From station ID must be a number",
  //       }),
  //       toStationId: z.number({
  //         required_error: "To station ID is required",
  //         invalid_type_error: "To station ID must be a number",
  //       }),
  //       e_class_amount: z.number({
  //         required_error: "E class amount is required",
  //         invalid_type_error: "E class amount must be a number",
  //       }),
  //       b_class_amount: z.number({
  //         required_error: "B class amount is required",
  //         invalid_type_error: "B class amount must be a number",
  //       }),
  //       // s_class_amount: z.number({
  //       //   required_error: "S class amount is required",
  //       //   invalid_type_error: "S class amount must be a number",
  //       // }),
  //       active: z.boolean({ required_error: "Active is required" }).default(true),
  //       sleeper_class_amount: z.number({
  //         required_error: "Sleeper class amount is required",
  //         invalid_type_error: "Sleeper class amount must be a number",
  //       }),
  //     }),
  //     {
  //       required_error: "Segments are required",
  //       invalid_type_error: "Segments must be an array of objects",
  //     }
  //   )
  //   .min(1, "At least one segment is required"),
});

export type AddUpdateRouteDataProps = z.infer<typeof addUpdateRouteSchema>;
