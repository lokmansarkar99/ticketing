import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { NetDepositCalculation } from "./NetDepositeCalculation";

interface IDayWiseSalesStateProps {
  fromCalenderOpen: boolean;
  toCalenderOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  branchPayMethod: string;
  accountType: string;
  searchBy: string;
  classType: string;
  mobileNo: string;
}

const DayWiseSales = () => {
  const [dayWiseSalesState, setDayWiseSalesState] =
    useState<IDayWiseSalesStateProps>({
      fromCalenderOpen: false,
      toCalenderOpen: false,
      fromDate: null,
      toDate: null,
      branchPayMethod: "",
      accountType: "",
      searchBy: "",
      classType: "",
      mobileNo: "",
    });

  const { translate } = useCustomTranslator();

  const accountTypes = [
    { id: "all", name: "All Accounts" },
    { id: "savings", name: "Savings" },
    { id: "current", name: "Current" },
  ];

  const searchByOptions = [
    { id: "name", name: "Name" },
    { id: "account", name: "Account No" },
    { id: "mobile", name: "Mobile No" },
  ];

  const classOptions = [
    { id: "economy", name: "Economy" },
    { id: "business", name: "Business" },
    { id: "first", name: "First Class" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            {translate("দিন অনুসারে বিক্রয় রিপোর্ট", "Day Wise Sales Report")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
            {/* Branch/Pay Method */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Branch/Pay Method *
              </label>
              <Input
                value={dayWiseSalesState.branchPayMethod}
                onChange={(e) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    branchPayMethod: e.target.value,
                  }))
                }
                placeholder="Enter branch/pay method"
              />
            </div>

            {/* From Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                From Date *
              </label>
              <Popover
                open={dayWiseSalesState.fromCalenderOpen}
                onOpenChange={(open) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    fromCalenderOpen: open,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dayWiseSalesState.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dayWiseSalesState.fromDate ? (
                      format(dayWiseSalesState.fromDate, "dd/MM/yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dayWiseSalesState.fromDate || new Date()}
                    onSelect={(date) =>
                      setDayWiseSalesState((prev) => ({
                        ...prev,
                        fromDate: date || new Date(),
                        fromCalenderOpen: false,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                To Date *
              </label>
              <Popover
                open={dayWiseSalesState.toCalenderOpen}
                onOpenChange={(open) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    toCalenderOpen: open,
                  }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dayWiseSalesState.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dayWiseSalesState.toDate ? (
                      format(dayWiseSalesState.toDate, "dd/MM/yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dayWiseSalesState.toDate || new Date()}
                    onSelect={(date) =>
                      setDayWiseSalesState((prev) => ({
                        ...prev,
                        toDate: date || new Date(),
                        toCalenderOpen: false,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Account Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Account Type
              </label>
              <Select
                value={dayWiseSalesState.accountType}
                onValueChange={(value) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    accountType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search By */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Search By
              </label>
              <Select
                value={dayWiseSalesState.searchBy}
                onValueChange={(value) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    searchBy: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {searchByOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Class</label>
              <Select
                value={dayWiseSalesState.classType}
                onValueChange={(value) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    classType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile No */}
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Mobile No
              </label>
              <Input
                value={dayWiseSalesState.mobileNo}
                onChange={(e) =>
                  setDayWiseSalesState((prev) => ({
                    ...prev,
                    mobileNo: e.target.value,
                  }))
                }
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Reset</Button>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              {translate("", "Report Results")}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button variant={"primary"} size={"xs"}>
                Pdf
              </Button>
              <Button variant={"default"} size={"xs"}>
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <NetDepositCalculation
            data={{
              totalSold: 20700,
              totalComplementary: 0,
              fareRefund: 2400,
              totalRefund: 2400,
              calculationCharge: 0,
              migrationCharge: 0,
            }}
            labels={{
              totalSold: "Total Revenue",
              totalDeposit: "Net Deposit",
            }}
            currencySymbol="৳"
          />
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {translate("তথ্য পাওয়া যায়নি", "Data Not Found")}
            </h3>
            <p className="text-gray-500">
              {translate(
                "আপনার বর্তমান ফিল্টারগুলোর সাথে কোনো রেকর্ড মেলেনি",
                "No records match your current filters"
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayWiseSales;
