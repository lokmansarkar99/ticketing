import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { apiSlice } from "../rootApi/apiSlice";

const fileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // UPLOADING PHOTO
    uploadPhoto: builder.mutation({
      query: (uploadFile) => {
        const newFile = new File(
          [uploadFile],
          appConfiguration.appName + "photo",
          {
            type: "image/png",
            lastModified: Date.now(),
          }
        );

        const data = new FormData();
        data.append("image", newFile);

        return {
          url: "/file/upload",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["file"],
    }),
  }),
});

export const { useUploadPhotoMutation } = fileApi;
