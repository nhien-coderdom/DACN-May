import CheckoutSteps from "../checkout/components/CheckoutSteps";
import ShippingForm from "../checkout/components/ShippingForm";
import PaymentSection from "../checkout/components/PaymentSection";
import LoyaltyPointsSection from "../checkout/components/LoyaltyPointsSection";
import ConfirmationSection from "../checkout/components/ConfirmationSection";
import OrderSummary from "../checkout/components/OrderSummary";
import { useCheckout } from "../checkout/hooks/useCheckout";

function Checkout() {
  const {
    cart,
    user,
    step,
    setStep,
    formData,
    handleInputChange,
    savedAddresses,
    selectedAddressId,
    isAddingNewAddress,
    setAsDefaultAddress,
    editingAddressId,
    onSelectAddress,
    onEditAddress,
    onDeleteAddress,
    onStartAddNew,
    onCancelAddOrEdit,
    onSaveAddress,
    onToggleDefault,
    usePointsAmount,
    setUsePointsAmount,
    maxPointsCanUse,
    subtotal,
    discountFromPoints,
    finalAmount,
    handleBackStep,
    handleSubmit,
    goHome,
  } = useCheckout();

  if (cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center mt-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Giỏ hàng trống
        </h1>
        <button
          onClick={goHome}
          className="rounded-full bg-[#6c935b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-8 sm:py-12 px-4 sm:px-0">
      <CheckoutSteps step={step} onStepChange={setStep} />

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <ShippingForm
                userName={user?.name}
                userPhone={user?.phone}
                formData={formData}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                isAddingNewAddress={isAddingNewAddress}
                setAsDefaultAddress={setAsDefaultAddress}
                editingAddressId={editingAddressId}
                onInputChange={handleInputChange}
                onSelectAddress={onSelectAddress}
                onEditAddress={onEditAddress}
                onDeleteAddress={onDeleteAddress}
                onStartAddNew={onStartAddNew}
                onCancelAddOrEdit={onCancelAddOrEdit}
                onSaveAddress={onSaveAddress}
                onToggleDefault={onToggleDefault}
              />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <PaymentSection
                  paymentMethod={formData.paymentMethod}
                  onChange={handleInputChange}
                />

                {user && (user.loyaltyPoint || 0) > 0 && (
                  <LoyaltyPointsSection
                    loyaltyPoints={user.loyaltyPoint || 0}
                    usePointsAmount={usePointsAmount}
                    maxPointsCanUse={maxPointsCanUse}
                    onChange={setUsePointsAmount}
                  />
                )}
              </div>
            )}

            {step === 3 && <ConfirmationSection formData={formData} />}

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex-1 rounded-lg border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                >
                  Quay lại
                </button>
              )}

              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#6c935b] py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                {step === 3 ? "Đặt hàng" : "Tiếp tục"}
              </button>
            </div>
          </form>
        </div>

        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          usePointsAmount={usePointsAmount}
          discountFromPoints={discountFromPoints}
          finalAmount={finalAmount}
        />
      </div>
    </div>
  );
}

export default Checkout;