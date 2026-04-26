import { ProfileForm } from "@/components/forms/profile-form";
import { ProfileImageForm } from "@/components/forms/profile-image-form";
import { services } from "@/data/services";
import { validateApiResponse } from "@/lib/error-handler";

export default async function AccountRoute() {
  const user = await services.auth.getUserMeService();
  const userData = validateApiResponse(user, "user profile");
  const userImage = userData?.image;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-5">
      <ProfileForm className="lg:col-span-3" user={userData} />
      <ProfileImageForm className="lg:col-span-2" image={userImage} />
    </div>
  );
}
