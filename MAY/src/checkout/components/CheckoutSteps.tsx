import { FiCheck } from "react-icons/fi";
import type { CheckoutStep } from "../types/checkout.types";
import { CHECKOUT_STEPS } from "../constants/checkout.constant";

interface CheckoutStepsProps {
  step: CheckoutStep;
  onStepChange: (step: CheckoutStep) => void;
}

export default function CheckoutSteps({
  step,
  onStepChange,
}: CheckoutStepsProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 mb-6 sm:mb-8 mt-10">
        Thanh toán
      </h1>

      <div className="flex gap-4 sm:gap-8 overflow-x-auto">
        {CHECKOUT_STEPS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
            onClick={() => step > item.id && onStepChange(item.id)}
          >
            <div
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-xs sm:text-sm transition ${
                item.id < step
                  ? "bg-[#6c935b] text-white"
                  : item.id === step
                  ? "bg-[#6c935b] text-white ring-4 ring-orange-100"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {item.id < step ? <FiCheck size={18} /> : item.id}
            </div>

            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Bước {item.id}
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}