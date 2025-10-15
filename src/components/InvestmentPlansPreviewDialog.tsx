import { useState } from "react";

import { Eye } from "lucide-react";

import { PaymentPlanCard, type PlanHighlight } from "@/components/PaymentPlanCard";
import { FlexiblePaymentPlanCard } from "@/components/FlexiblePaymentPlanCard";
import { InvestmentCompletePlanCard } from "@/components/InvestmentCompletePlanCard";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ProgramGalleryGrid,
  type ProgramGalleryItem,
} from "@/components/ProgramGalleryGrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InvestmentPlansPreviewDialogProps {
  financingHighlights: PlanHighlight[];
  galleryItems: ProgramGalleryItem[];
}

export const InvestmentPlansPreviewDialog = ({
  financingHighlights,
  galleryItems,
}: InvestmentPlansPreviewDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mx-auto flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Ver vista previa del diseño
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Vista previa de los modelos de inversión</DialogTitle>
          <DialogDescription className="text-left">
            Utiliza las pestañas para alternar entre la comparativa de
            modelos y la galería fotográfica con la nueva distribución de
            imágenes.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="plans" className="mt-4 space-y-6">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="plans">Modelos de inversión</TabsTrigger>
            <TabsTrigger value="gallery">Galería fotográfica</TabsTrigger>
          </TabsList>
          <TabsContent value="plans" className="mt-0">
            <div className="grid gap-6 lg:grid-cols-3">
              <PaymentPlanCard
                title="Amortización Total"
                monthlyPayment="0€ al mes"
                amortization="30 meses en la RedGW"
                note="Empieza sin desembolsos y amortiza el programa gracias a tu trabajo en Noruega."
                highlights={financingHighlights}
                disableActions
              />
              <FlexiblePaymentPlanCard
                displayMode="preview"
                showPopularityBadge
              />
              <InvestmentCompletePlanCard disableActions />
            </div>
          </TabsContent>
          <TabsContent value="gallery" className="mt-0">
            <ProgramGalleryGrid items={galleryItems} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
