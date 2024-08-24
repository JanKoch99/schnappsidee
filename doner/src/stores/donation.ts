import { create } from "zustand";
import { z } from "zod";
import { persist, createJSONStorage } from "zustand/middleware";

export const VictimSchema = z.object({
  email: z.string().email(),
  name: z.string().regex(/^[a-zA-Z\s.]{3,}$/, {
    message: "Are you kidding me? That's the name?",
  }),
});

export const DonationSchema = z.object({
  victim: VictimSchema,
  drink: z.string().min(3),
});

export const useDonationStore = create<
  z.infer<typeof DonationSchema> & {
    setVictim: (victim: z.infer<typeof VictimSchema>) => void;
    setDrink: (drink: string) => void;
  }
>()(
  persist<
    z.infer<typeof DonationSchema> & {
      setVictim: (victim: z.infer<typeof VictimSchema>) => void;
      setDrink: (drink: string) => void;
    }
  >(
    (set) => ({
      victim: {
        email: "",
        name: "",
      },
      drink: "",
      setVictim: (victim: z.infer<typeof VictimSchema>) =>
        set(() => ({
          victim,
        })),
      setDrink: (drink: string) => set({ drink }),
    }),
    {
      name: "victim-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
