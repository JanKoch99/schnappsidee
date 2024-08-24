import { create } from "zustand";
import { z } from "zod";
import { persist, createJSONStorage } from "zustand/middleware";

export const DonationSchema = z.object({
  phone: z
    .string()
    .regex(
      /(\b(0041)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/,
      {
        message: "Phone number must be valid!",
      }
    ),
  name: z.string().regex(/^[a-zA-Z\s.]{3,}$/, {
    message: "Are you kidding me? That's the name?",
  }),
});
export const useDonationStore = create<
  z.infer<typeof DonationSchema> & {
    setDonation: (victim: z.infer<typeof DonationSchema>) => void;
  }
>()(
  persist<
    z.infer<typeof DonationSchema> & {
      setDonation: (victim: z.infer<typeof DonationSchema>) => void;
    }
  >(
    (set) => ({
      phone: "",
      name: "",
      drink: "",
      setDonation: (victim: z.infer<typeof DonationSchema>) =>
        set(() => victim),
    }),
    {
      name: "victim-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
