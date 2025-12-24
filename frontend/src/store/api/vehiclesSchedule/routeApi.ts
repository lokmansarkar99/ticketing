import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const routeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING ROUTE
    addRoute: builder.mutation({
      query: (data) => ({
        url: "/route/create-route",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["route"],
    }),

    //GETTING ALL ROUTES
    getRoutes: builder.query({
      query: (data) => ({
        url: `/route/get-route-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["route"],
    }),

    // GETTING SINGLE ROUTE
    getSingleRoute: builder.query({
      query: (id) => ({
        url: `/route/get-route-single/${id}`,
      }),
      providesTags: ["route"],
    }),

    // UPDATING ROUTE
    updateRoute: builder.mutation({
      query: ({ id, data }) => ({
        url: `/route/update-route/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["route"],
    }),

    // DELETING ROUTE
    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `/route/delete-route/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["route"],
    }),
  }),
});

export const {
  useAddRouteMutation,
  useDeleteRouteMutation,
  useGetRoutesQuery,
  useGetSingleRouteQuery,
  useUpdateRouteMutation,
} = routeApi;
