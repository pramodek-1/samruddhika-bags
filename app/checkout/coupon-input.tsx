import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CouponInput() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Have a coupon?</h2>
      <div className="flex space-x-2">
        <Input placeholder="Enter your code" className="max-w-xs" />
        <Button>Apply</Button>
      </div>
    </div>
  )
}

