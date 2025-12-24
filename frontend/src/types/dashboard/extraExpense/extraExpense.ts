export interface IExpensePayment {
    accountId: number; 
    paymentAmount: number; 
  }
  
  export interface IExtraExpense {
    name: string; 
    expenseCategoryId: number; 
    expenseSubcategoryId: number; 
    totalAmount: number; 
    date: string; 
    file?: string; 
    note?: string; 
    payments: IExpensePayment[];
  }
  