import { apiSlice } from "../../rootApi/apiSlice";

const supervisorExpenseCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING EXPENSE CATEGORY
    addSupervisorExpenseCategory: builder.mutation({
      query: (data) => ({
        url: "/expense-category/create-expense-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["supervisor_expense_category"],
    }),

    // GETTING ALL EXPENSE CATEGORIES
    getSupervisorExpenseCategories: builder.query({
      query: () => ({
        url: "/expense-category/get-expense-category-all",
      }),
      providesTags: ["supervisor_expense_category"],
    }),

    // GETTING SINGLE EXPENSE CATEGORY BY ID
    getSingleSupervisorExpenseCategory: builder.query({
      query: (id) => ({
        url: `/expense-category/get-expense-category-single/${id}`,
      }),
      providesTags: (id) => [{ type: "supervisor_expense_category", id }],
    }),

    // UPDATING EXPENSE CATEGORY
    updateSupervisorExpenseCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/expense-category/update-expense-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ({ id }) => [
        { type: "supervisor_expense_category", id },
      ],
    }),

    // DELETING EXPENSE CATEGORY
    deleteSupervisorExpenseCategory: builder.mutation({
      query: (id) => ({
        url: `/expense-category/delete-expense-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supervisor_expense_category"],
    }),
  }),
});

export const {
  useAddSupervisorExpenseCategoryMutation,
  useGetSupervisorExpenseCategoriesQuery,
  useGetSingleSupervisorExpenseCategoryQuery,
  useUpdateSupervisorExpenseCategoryMutation,
  useDeleteSupervisorExpenseCategoryMutation,
} = supervisorExpenseCategoryApi;

export default supervisorExpenseCategoryApi;
