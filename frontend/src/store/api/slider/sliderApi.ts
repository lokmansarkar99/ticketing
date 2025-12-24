import { apiSlice } from "../../rootApi/apiSlice";

const sliderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING SLIDER
    addSlider: builder.mutation({
      query: (data) => ({
        url: "/slider/create-slider",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["slider"],
    }),

    // GETTING ALL SLIDERS
    getSliderAllList: builder.query({
      query: () => ({
        url: `/slider/get-slider-all`,
      }),
      providesTags: ["slider"],
    }),

    // GETTING SINGLE SLIDER BY ID
    getSingleSlider: builder.query({
      query: (id) => ({
        url: `/slider/get-slider-single/${id}`,
      }),
      providesTags: ["slider"],
    }),

    // UPDATING SLIDER
    updateSlider: builder.mutation({
      query: ({ id, data }) => ({
        url: `/slider/update-slider/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["slider"],
    }),

    // DELETING SLIDER
    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/slider/delete-slider/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["slider"],
    }),
  }),
});

export const {
  useAddSliderMutation,
  useGetSliderAllListQuery,
  useGetSingleSliderQuery,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;
