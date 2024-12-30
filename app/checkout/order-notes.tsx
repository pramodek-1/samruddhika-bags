import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface OrderNotesProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function OrderNotes({ value, onChange }: OrderNotesProps) {
  return (
    <div className="mt-6">
      <Label htmlFor="notes">Order notes (optional)</Label>
      <Textarea 
        id="notes"
        value={value}
        onChange={onChange}
        placeholder="Notes about your order, e.g. special notes for delivery" 
      />
    </div>
  )
}

