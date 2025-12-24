import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const supervisorCollectionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COUNTER
    addCollectionOfSupervisor: builder.mutation({
      query: (data) => ({
        url: "/collection/create-collection",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["supervisor"],
    }),

    //GETTING ALL COUNTERS
    /*getCounters: builder.query({
      query: (data) => ({
        url: `/collection/get-collection-all?search=${
          data?.search || ""
        }&size=${data?.size || fallback.querySize}&page=${
          data?.page || 1
        }&sortOrder=${data?.sort || fallback.sortOrder}`,
      }),
      providesTags: ["counter"],
    }),*/

    // GETTING SINGLE COUNTER
    getSupervisorCollectionAllList: builder.query({
      query: ({ search, sort, page, size }) => ({
        url: `/collection/get-collection-all?search=${search || ""}&size=${
          size || fallback.querySize
        }&page=${page || 1}&sortOrder=${sort || fallback.sortOrder}`,
      }),
      providesTags: ["supervisor"],
    }),
    getTodaysCoachConfigList: builder.query({
      query: (role = "") => ({
        url: `/coach-config/get-coach-list-today?supervisor=${role}`,
      }),
      providesTags: ["supervisor"],
    }),
    // GETTING SINGLE COUNTER
    getSingleCollectionSupervisor: builder.query({
      query: (id) => ({
        url: `/collection/get-collection-single/${id}`,
      }),
      providesTags: ["supervisor"],
    }),

    // UPDATING COUNTER
    updateCollectionSupervisor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/collection/update-collection/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["supervisor"],
    }),

    // DELETING COUNTER
    deleteCollectionOfSupervisor: builder.mutation({
      query: (id) => ({
        url: `/collection/delete-collection/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["counter"],
    }),
  }),
});

export const {
  useGetSupervisorCollectionAllListQuery,
  useGetSingleCollectionSupervisorQuery,
  useAddCollectionOfSupervisorMutation,
  useDeleteCollectionOfSupervisorMutation,
  useUpdateCollectionSupervisorMutation,
  useGetTodaysCoachConfigListQuery,
} = supervisorCollectionApi;
