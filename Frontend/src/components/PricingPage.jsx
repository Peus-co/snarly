import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GlareHover } from "@/components/ui/glare-hover"
import RubberSegment from "@/components/RubberSegment"
import Nave from "@/components/nave"

export function PricingCard({ plan, yearly }) {
  const priceNum = yearly ? plan.yearlyPrice : plan.monthlyPrice
  const displayPrice = `$${Number.isInteger(priceNum) ? priceNum : priceNum.toFixed(2)}`

  return (
    <GlareHover className="rounded-xl w-full h-full" duration={600}>
      <Card className="w-full h-full flex flex-col bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{plan.name}</CardTitle>
            {plan.popular && (
              <Badge className="bg-white text-black hover:bg-white/80 border-transparent">
                Popular
              </Badge>
            )}
          </div>
          <CardDescription className="text-zinc-400 min-h-[40px]">{plan.description}</CardDescription>
          <div className="flex items-baseline gap-1 pt-2">
            <span className="text-4xl font-semibold tracking-tight text-white">{displayPrice}</span>
            {priceNum > 0 && <span className="text-zinc-400 text-sm">/mo</span>}
          </div>
          <div className="min-h-[20px]">
            {priceNum > 0 && (
              <span className="text-zinc-500 text-xs">Get $10 off with the yearly plan</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-2.5">
          {plan.features.map((f, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-zinc-200">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-white shrink-0">
                <path
                  d="M12.5 3.5L6 10L2.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{f}</span>
            </div>
          ))}
          <div className="mt-auto pt-4 min-h-[40px]">
            {plan.extraFeature && (
              <div className="text-zinc-500 flex items-center gap-2 text-sm">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="1.5"
                    fill="currentColor"
                    opacity="0.4"
                  />
                </svg>
                {plan.extraFeature}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-6">
          <Button className="w-full bg-white text-black hover:bg-white/80 border-transparent">
            {plan.cta}
          </Button>
        </CardFooter>
      </Card>
    </GlareHover>
  )
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("Month")
  const yearly = billingCycle === "Year"

  const plans = [
    {
      name: "Free",
      price: "$0",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for getting started",
      features: [
        "Limited projects",
        "Basic analytics",
        "Community support",
      ],
      popular: false,
      cta: "Get Started",
      extraFeature: null
    },
    {
      name: "Pro",
      price: "$29",
      monthlyPrice: 29,
      yearlyPrice: 19,
      description: "For teams that need more",
      features: [
        "Unlimited projects",
        "Team collaboration",
        "Advanced analytics",
      ],
      popular: true,
      cta: "Get Started",
      extraFeature: "SSO (coming soon)"
    },
    {
      name: "Enterprise",
      price: "$49",
      monthlyPrice: 49,
      yearlyPrice: 39,
      description: "For organizations with complex needs",
      features: [
        "Everything in Pro",
        "Priority support",
        "Custom integrations",
        "SLA guarantee",
      ],
      popular: false,
      cta: "Contact Sales",
      extraFeature: null
    }
  ]

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">
      {/* Fixed transparent top navigation */}
      <Nave activeIndex={4} />

      <div className="container mx-auto py-16 sm:py-24 px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white tracking-tight">Choose Your Plan</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
            Select the perfect plan for your needs. All plans include core features, 
            with upgraded options for growing teams.
          </p>
        </div>
        
        <div className="flex justify-center mb-10 sm:mb-16 scale-90 sm:scale-100">
          <RubberSegment
            items={["Month", "Year"]}
            value={billingCycle}
            onChange={(value) => setBillingCycle(value)}
            trackColor="#27272a"
            thumbColor="#fafafa"
            textColor="#fafafa"
            activeTextColor="#18181b"
            size="md"
            radius={10}
            inset={3}
            equalSlots
            stretch={100}
            squash={3}
            speed={1}
            glide={75}
            draggable
            preset="periods"
            disabled={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} yearly={yearly} />
          ))}
        </div>
      </div>
    </div>
  )
}