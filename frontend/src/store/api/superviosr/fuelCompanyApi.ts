import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const fuelCompanyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING FUEL COMPANY
    addFuelCompany: builder.mutation({
      query: (data) => ({
        url: "/fuel-company/create-fuel-company",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["fuelCompany"],
    }),

    // GETTING ALL FUEL COMPANIES
    getFuelCompanyAllList: builder.query({
      query: (data) => ({
        url: `/fuel-company/get-fuel-company-all?search=${
          data?.search || ""
        }&size=${data?.size || fallback.querySize}&page=${
          data?.page || 1
        }&sortOrder=${data?.sort || fallback.sortOrder}`,
      }),
      providesTags: ["fuelCompany"],
    }),

    // GETTING SINGLE FUEL COMPANY BY ID
    getSingleFuelCompany: builder.query({
      query: (id) => ({
        url: `/fuel-company/get-fuel-company-single/${id}`,
      }),
      providesTags: ["fuelCompany"],
    }),

    // UPDATING FUEL COMPANY
    updateFuelCompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `/fuel-company/update-fuel-company/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["fuelCompany"],
    }),

    // DELETING FUEL COMPANY
    deleteFuelCompany: builder.mutation({
      query: (id) => ({
        url: `/fuel-company/delete-fuel-company/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fuelCompany"],
    }),
  }),
});

export const {
  useGetFuelCompanyAllListQuery,
  useGetSingleFuelCompanyQuery,
  useAddFuelCompanyMutation,
  useUpdateFuelCompanyMutation,
  useDeleteFuelCompanyMutation,
} = fuelCompanyApi;
