"use client";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSingleCustomerByIdQuery, useUpdateCustomerMutation } from "@/store/api/authenticationApi";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";

export default function UpdateProfile() {
  const { email, phone, name, id, address } = shareAuthentication();
  const { data: customerData, refetch } = useGetSingleCustomerByIdQuery(id);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: customerData?.data?.name || "",
    email: customerData?.data?.email || "",
    address: customerData?.data?.address || "",
    contactNo: customerData?.data?.phone || ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const { translate } = useCustomTranslator();

  // Update form data when customerData changes (after API call)
useEffect(() => {
  if (customerData && customerData.data) {
    setFormData({
      name: customerData.data.name || name || "",
      email: customerData.data.email || email || "",
      address: customerData.data.address || address || "",
      contactNo: customerData.data.phone || phone || ""
    });
  }
}, [customerData, name, email, address, phone]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare the data according to your backend expectations
      const updateData = {
        name: formData.name,
        email: formData.email,
        address: formData.address
      };
      
      const customerId = customerData?.data?.id || id;
      
      if (!customerId) {
        toast.error("Customer ID not found");
        return;
      }
      
      const response = await updateCustomer({ 
        id: customerId, 
        data: updateData 
      }).unwrap();

      // Check if the response contains a success message
      if (response.success) {
        // Show success message
        toast.success("Customer profile has been updated");
        
        // Refetch the customer data to update the UI with latest data
        refetch();
        
        // Exit edit mode on success
        setIsEditing(false);
      } else {
        toast.error("Update failed: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Something went wrong. Please try again");
    }
  };

  // Reset form when canceling edit
  const handleCancel = () => {
    // Reset to the latest customerData from the API
    if (customerData) {
      setFormData({
        name: customerData?.data?.name || "",
        email: customerData?.data?.email || "",
        address: customerData?.data?.address || "",
        contactNo: customerData?.data?.contactNo || ""
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 shadow-sm dark:bg-black dark:border border-gray-300 rounded-md dark:text-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white">
            {translate(
              "অ্যাকাউন্ট বিবরণ সম্পাদনা করুন",
              "Edit Account Details"
            )}
          </h2>
        </div>
        <Button
          variant={"outline"}
          className="text-white bg-[#830494] hover:bg-primary  dark:bg-primary dark:text-white hover:text-white flex gap-x-[8px] items-center border border-gray-300 rounded-md px-4 py-1"
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          type="button"
        >
          <FiEdit size={20} />
          {isEditing
            ? translate("বাতিল করুন", "Cancel")
            : translate("সম্পাদনা", "Edit")}
        </Button>
      </div>

      <form className="lg:space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4">
          <InputWrapper labelFor="Name" label="Name">
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              disabled={!isEditing}
            />
          </InputWrapper>

          <InputWrapper labelFor="Contact Number" label="Contact Number">
            <Input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              className="flex-1 outline-none text-sm"
              readOnly
              disabled
            />
          </InputWrapper>

          <InputWrapper labelFor="Email" label="Email">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              disabled={!isEditing}
            />
          </InputWrapper>

          <InputWrapper labelFor="Address" label="Address">
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              disabled={!isEditing}
            />
          </InputWrapper>
        </div>
        {isEditing && (
          <div className="pt-2 flex justify-end items-end">
            <Button
              type="submit"
              className="w-full lg:w-[150px] h-[40px] bg-[#830494] hover:bg-primary text-white font-semibold py-2 rounded-md transition"
              disabled={isLoading}
            >
              {isLoading 
                ? translate("আপডেট হচ্ছে...", "Updating...") 
                : translate("পরিবর্তনগুলি সংরক্ষণ করুন", "Save Changes")
              }
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}