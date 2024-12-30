import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BillingDetailsFormProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BillingDetailsForm({ formData, onChange }: BillingDetailsFormProps) {
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First name *</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={onChange}
            required 
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last name *</Label>
          <Input id="lastName" value={formData.lastName} onChange={onChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company name (optional)</Label>
        <Input id="company" value={formData.company} onChange={onChange} />
      </div>
      <div>
        <Label htmlFor="country">Country / Region *</Label>
        <Input id="country" value="Sri Lanka" disabled />
      </div>
      <div>
        <Label htmlFor="state">State / Province *</Label>
        <Input id="state" placeholder="Ex: North Central Province" value={formData.state} onChange={onChange} required />
      </div>
      <div>
        <Label htmlFor="state">District *</Label>
        <Input id="district" placeholder="Ex: Anuradhapura" value={formData.district} onChange={onChange} required />
      </div>
      <div>
        <Label htmlFor="street">Street address *</Label>
        <Input id="street" placeholder="House number and street name" value={formData.street} onChange={onChange} required />
      </div>
      <div>
        <Label htmlFor="apartment">Apartment, suite, unit, etc. (optional)</Label>
        <Input id="apartment" value={formData.apartment} onChange={onChange} />
      </div>
      <div>
        <Label htmlFor="city">Town / City *</Label>
        <Input id="city" placeholder="Ex: Thambuttegama" value={formData.city} onChange={onChange} required />
      </div>
      <div>
        <Label htmlFor="postcode">Postcode / ZIP (optional)</Label>
        <Input id="postcode" value={formData.postcode} onChange={onChange} />
      </div>
      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input 
          id="phone" 
          placeholder="Ex: 0724149720"
          type="tel" 
          required 
          inputMode="numeric" 
          pattern="[0-9]*"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div>
        <Label htmlFor="phone-2">2<sup>nd</sup> Phone (optional)</Label>
        <Input 
          id="phone-2" 
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div>
        <Label htmlFor="email">Email address *</Label>
        <Input id="email" placeholder="Ex: contact@samruddhikabags.lk" type="email" value={formData.email} onChange={onChange} required />
      </div>
    </div>
  )
}

