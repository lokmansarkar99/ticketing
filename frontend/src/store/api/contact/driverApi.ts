import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING DRIVER
    addDriver: builder.mutation({
      query: (data) => ({
        url: "/driver/create-driver",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["driver"],
    }),

    //GETTING ALL DRIVERS
    getDrivers: builder.query({
      query: (data) => ({
        url: `/driver/get-driver-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["driver"],
    }),

    // GETTING SINGLE DRIVER
    getSingleDriver: builder.query({
      query: (id) => ({
        url: `/driver/get-driver-single/${id}`,
      }),
      providesTags: ["driver"],
    }),

    // UPDATING DRIVER
    updateDriver: builder.mutation({
      query: ({ id, data }) => ({
        url: `/driver/update-driver/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["driver"],
    }),

    // DELETING DRIVER
    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/driver/delete-driver/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["driver"],
    }),
  }),
});

export const {
  useAddDriverMutation,
  useDeleteDriverMutation,
  useGetDriversQuery,
  useGetSingleDriverQuery,
  useUpdateDriverMutation,
} = driverApi;
