import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const stationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING STATION
    addStation: builder.mutation({
      query: (data) => ({
        url: "/station/create-station",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["station"],
    }),

    //GETTING ALL STATION
    getStations: builder.query({
      query: (data) => ({
        url: `/station/get-station-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["station"],
    }),

    // GETTING SINGLE STATION
    getSingleStation: builder.query({
      query: (id) => ({
        url: `/station/get-station-single/${id}`,
      }),
      providesTags: ["station"],
    }),

    // UPDATING STATION
    updateStation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/station/update-station/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["station"],
    }),

    // DELETING STATION
    deleteStation: builder.mutation({
      query: (id) => ({
        url: `/station/delete-station/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["station"],
    }),
  }),
});

export const {
  useAddStationMutation,
  useDeleteStationMutation,
  useGetSingleStationQuery,
  useGetStationsQuery,
  useUpdateStationMutation,
} = stationApi;
