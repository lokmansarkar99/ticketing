import { apiSlice } from "@/store/rootApi/apiSlice";
import { fallback } from "@/utils/constants/common/fallback";

const expenseCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING EXPENSE CATEGORY
    addExpenseCategory: builder.mutation({
      query: (data) => ({
        url: "/expense-category/create-expense-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["expense_category"],
    }),

    // GETTING ALL EXPENSE CATEGORIES
    getAllExpenseCategories: builder.query({
      query: (data) => ({
        url: `/expense-category/get-expense-category-all?search=${
          data?.search || ""
        }&page=${data?.page || 1}&size=${
          data?.size || fallback.querySize
        }&sortOrder=${data?.sort || "asc"} `,
      }),
      providesTags: ["expense_category"],
    }),

    // GETTING SINGLE EXPENSE CATEGORY BY ID
    getSingleExpenseCategory: builder.query({
      query: (id) => ({
        url: `/expense-category/get-expense-category-single/${id}`,
      }),
      providesTags: ["expense_category"],
    }),

    // UPDATING EXPENSE CATEGORY BY ID
    updateExpenseCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/expense-category/update-expense-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["expense_category"],
    }),

    // DELETING EXPENSE CATEGORY BY ID
    deleteExpenseCategory: builder.mutation({
      query: (id) => ({
        url: `/expense-category/delete-expense-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expense_category"],
    }),
  }),
});

export const {
  useAddExpenseCategoryMutation,
  useGetAllExpenseCategoriesQuery,
  useGetSingleExpenseCategoryQuery,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
