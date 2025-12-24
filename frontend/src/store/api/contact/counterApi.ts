import { apiSlice } from "../../rootApi/apiSlice";

const counterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COUNTER
    addCounter: builder.mutation({
      query: (data) => ({
        url: "/counter/create-counter",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["counter"],
    }),

    //GETTING ALL COUNTERS
    getCounters: builder.query({
      query: (data) => {
        const params = new URLSearchParams({
          search: data.search || "",
          name: data.name || "",
          address: data.address || "",
          stationId: data.stationId || "",
          status: data.status || "",
          type: data.type || "",
          size: data.size,
          page: data.page,
          sortOrder: data.sort,
        });

        return {
          url: `/counter/get-counter-all?${params.toString()}`,
        };
      },
      providesTags: ["counter"],
    }),
    getCountersLocation: builder.query({
      query: () => ({
        url: `/counter/get-counter-all-by-station`,
      }),
      providesTags: ["counter"],
    }),

    // GETTING SINGLE COUNTER
    getSingleCounter: builder.query({
      query: (id) => ({
        url: `/counter/get-counter-single/${id}`,
      }),
      providesTags: ["counter"],
    }),
    getCounterById: builder.query({
      query: (id) => ({
        url: `/counter/get-counter-by-route/${id}`,
      }),
      providesTags: ["counter"],
    }),

    // UPDATING COUNTER
    updateCounter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/counter/update-counter/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["counter"],
    }),

    // DELETING COUNTER
    deleteCounter: builder.mutation({
      query: (id) => ({
        url: `/counter/delete-counter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["counter"],
    }),
  }),
});

export const {
  useAddCounterMutation,
  useDeleteCounterMutation,
  useGetCountersQuery,
  useGetSingleCounterQuery,
  useUpdateCounterMutation,
  useGetCounterByIdQuery,
  useGetCountersLocationQuery,
} = counterApi;
