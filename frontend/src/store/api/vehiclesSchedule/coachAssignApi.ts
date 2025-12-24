import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const coachAssignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COACH
    addCoachAssign: builder.mutation({
      query: (data) => ({
        url: "/coach-assign/create-coach-assign",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coach"],
    }),

    //GETTING ALL COACH
    getCoachAssignAll: builder.query({
      query: (data) => ({
        url: `/coach-assign/get-coach-assign-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["coach"],
    }),

    // GETTING SINGLE COACH
    getSingleCoachAssign: builder.query({
      query: (id) => ({
        url: `/coach-assign/get-coach-assign-single/${id}`,
      }),
      providesTags: ["coach"],
    }),

    // UPDATING COACH
    updateCoachAssign: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coach-assign/update-coach-assign/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["coach"],
    }),

    // DELETING COACH
    deleteCoachAssign: builder.mutation({
      query: (id) => ({
        url: `/coach-assign/delete-coach-assign/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coach"],
    }),
  }),
});

export const {
    useAddCoachAssignMutation,
    useGetCoachAssignAllQuery,
    useGetSingleCoachAssignQuery,
    useUpdateCoachAssignMutation,
    useDeleteCoachAssignMutation
} = coachAssignApi;
