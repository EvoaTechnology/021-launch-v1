"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, Check, CreditCard, Sparkles,X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export default function Pricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for early-stage startups and solo founders",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "1 AI Co-founder",
        "Basic pitch deck generator",
        "Simple financial modeling",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Ideal for startups ready to scale and raise funding",
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        "3 AI Co-founders",
        "Advanced pitch deck generator",
        "Comprehensive financial modeling",
        "Investor simulation",
        "Priority support",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For established startups with complex needs",
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        "Unlimited AI Co-founders",
        "Custom pitch deck templates",
        "Advanced financial scenarios",
        "Investor network access",
        "Dedicated account manager",
        "API access",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const getDiscountPercentage = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12;
    const savings = monthlyTotal - yearly;
    return Math.round((savings / monthlyTotal) * 100);
  };

  
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  const openModal = (type: "terms" | "privacy") => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
  };
  
 

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          "linear-gradient(220deg, rgb(15, 15, 16) 20%, rgb(7, 20, 52) 40%, rgb(22, 21, 21) 100%)",
      }}
    >
      <header className="border-b border-[#1a237e] bg-[#0a1124] py-4 dark:border-[#1a237e] dark:bg-[#0a1124] sm:py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-400">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg text-white font-bold">Evoa O21</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Choose Your Plan
            </h1>
            <p className="mt-2 text-base text-blue-200 sm:mt-4 sm:text-lg">
              Select the perfect plan for your startup`s needs and get started
              with Evoa O21
            </p>
          </motion.div>

          <div className="mt-6 flex justify-center sm:mt-8">
            <div className="flex items-center gap-2 rounded-full bg-[#1a237e]/40 p-1.5 sm:p-1">
              <div className="flex items-center gap-2 px-2 sm:px-3">
                <Label
                  htmlFor="billing-toggle"
                  className="cursor-pointer text-xs font-medium text-blue-100 sm:text-sm">
                  Monthly
                </Label>
                <Switch
                  id="billing-toggle"
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) =>
                    setBillingCycle(checked ? "yearly" : "monthly")
                  }
                  className="scale-90 sm:scale-100"
                />
                <Label
                  htmlFor="billing-toggle"
                  className="cursor-pointer text-xs font-medium text-blue-100 sm:text-sm">
                  Yearly
                </Label>
              </div>
              {billingCycle === "yearly" && (
                <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-700/40 to-blue-400/40 px-2 py-0.5 text-xs font-medium text-blue-100">
                  <Sparkles className="h-3 w-3" />
                  <span>Save 20%</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 sm:mt-12">
            <RadioGroup
              value={selectedPlan}
              onValueChange={handlePlanSelect}
              className="grid gap-8 sm:gap-12 md:grid-cols-3"
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: plans.findIndex((p) => p.id === plan.id) * 0.1,
                  }}
                  whileHover={{ y: -5 }}>
                  <Card
                    className={`relative flex flex-col overflow-hidden transition-all bg-gradient-to-br from-[#283593]/80 via-[#3949ab]/70 to-[#5c6bc0]/60 text-white h-[34rem] ${
                      selectedPlan === plan.id
                        ? "border-blue-400 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-[#0a1124]"
                        : "border-blue-900/40 hover:border-blue-700/60"
                    }`}>
                    {/* Glass shine overlay for Enterprise */}
                    {plan.id === "enterprise" && (
                      <span
                        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full"
                        aria-hidden="true"
                      >
                        <span className="absolute left-[-40%] top-[-40%] h-[180%] w-[180%] rotate-12 bg-gradient-to-tr from-white/40 via-white/10 to-transparent blur-md opacity-70" />
                      </span>
                    )}
                    {plan.popular && (
                      <div className="absolute right-0 top-0">
                        <div className="flex h-8 items-center justify-center rounded-bl-lg rounded-tr-lg bg-gradient-to-r from-blue-700 via-blue-400 to-blue-300 px-3 text-xs font-medium text-white">
                          Most Popular
                        </div>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <CardHeader className="pb-6 pt-4 sm:pb-8 sm:pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="font-bold text-xl sm:text-xl text-white">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="mt-0.5 sm:mt-1 text-blue-100">
                              {plan.description}
                            </CardDescription>
                          </div>
                          <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className="h-4 w-4 sm:h-5 sm:w-5"
                          />
                        </div>
                        <div className="mt-3 sm:mt-4">
                          <span className="text-2xl font-bold sm:text-3xl text-white">
                            $
                            {billingCycle === "monthly"
                              ? plan.monthlyPrice
                              : plan.yearlyPrice}
                          </span>
                          <span className="text-blue-100">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                          {billingCycle === "yearly" && (
                            <div className="mt-0.5 text-xs text-blue-100 sm:mt-1 sm:text-sm">
                              Save{" "}
                              {getDiscountPercentage(
                                plan.monthlyPrice,
                                plan.yearlyPrice
                              )}
                              % with annual billing
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 sm:pb-6">
                        <ul className="space-y-2 sm:space-y-3">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-1.5 sm:gap-2">
                              <Check className="h-4 w-4 text-blue-300 sm:h-5 sm:w-5" />
                              <span className="text-xs sm:text-sm text-white">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>
                    <CardFooter className="mt-auto pt-2 pb-6">
                      <Button
                        className={`w-full ${
                          selectedPlan === plan.id
                            ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                            : "bg-blue-900/80 text-white hover:bg-blue-800"
                        }`}
                        variant={
                          selectedPlan === plan.id ? "default" : "outline"
                        }
                        onClick={() => handlePlanSelect(plan.id)}>
                        {plan.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </RadioGroup>
          </div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 rounded-lg border-0 bg-gradient-to-r from-[#1a237e]/80 to-[#283593]/80 p-4 shadow-md sm:mt-12 sm:p-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <h3 className="text-base font-medium sm:text-lg text-white">
                  Ready to accelerate your startup journey?
                </h3>
                <p className="mt-1 text-sm text-blue-100 sm:text-base">
                  Get started with Evoa O21 today and access powerful AI
                  co-founders.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-800 hover:to-blue-500 text-white md:w-auto"
                onClick={handlePayment}
                disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Complete Purchase
                  </>
                )}
              </Button>
            </div>
          </motion.div> */}

          <div className="mt-12 text-center">
            {/* <p className="text-sm text-blue-100">
              All plans include a 14-day money-back guarantee. No questions
              asked.
            </p> */}
            <p className="mt-2 text-xs text-blue-200">
              <a
                // href="https://vinkura.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 hover:underline">
                Powered by EVO-A Pvt. Ltd.
              </a>
            </p>

          </div>
        </div>
      </main>

      <footer className="border-t border-[#1a237e] bg-[#0a1124] py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row md:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-r from-blue-700 to-blue-400 sm:h-8 sm:w-8">
                <Brain className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
              </div>
              <span className="text-base font-bold sm:text-lg text-white">Evoa O21</span>
            </div>
            <div className="flex gap-4 sm:gap-6">
              {/* <a
                className="text-xs text-blue-100 hover:text-white sm:text-sm">
                Terms
              </a> */}
              <button
                onClick={() => openModal("terms")}
                className="text-xs text-blue-100 hover:text-white sm:text-sm"
              >
                Terms
              </button>
              <button
                onClick={() => openModal("privacy")}
                className="text-xs text-blue-100 hover:text-white sm:text-sm"
              >
                Privacy
              </button>
              {/* <a
                className="text-xs text-blue-100 hover:text-white sm:text-sm">
                Privacy
              </a> */}
              <a
                href="/contact"
                className="text-xs text-blue-100 hover:text-white sm:text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeModal} // close if click outside
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 rounded-md bg-gray-200 p-1 hover:bg-gray-300"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Modal Content */}
            {modalType === "terms" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Terms</h2>
                <p className="text-sm text-gray-700">
                  These are the Terms and Conditions. You can add your detailed
                  terms content here...
                </p>
              </>
            )}
            {modalType === "privacy" && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Privacy Policy
                </h2>
                <p className="text-sm text-gray-700">
                  This is the Privacy Policy. You can add your privacy
                  statement here...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
