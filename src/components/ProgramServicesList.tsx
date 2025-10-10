import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const programServices = [
  "Curso de Noruego hasta el B1+",
  "Curso de Helsenorsk (Noruego sanitario y procesos de trabajo en enfermería)",
  "Curso de Helsenorsk Enfermedades y Tratamientos",
  "Curso de Desarrollo Profesional y Cultura",
  "Curso Guía para la Vida en Noruega",
  "Autorización de trabajo",
  "Inserción Profesional en Noruega",
  "Coordinador/a durante el programa y tu llegada a Noruega",
];

interface ProgramServicesListProps {
  className?: string;
}

export const ProgramServicesList = ({ className }: ProgramServicesListProps) => {
  return (
    <ul className={cn("mt-4 space-y-2 text-sm text-foreground", className)}>
      {programServices.map((service) => {
        const needsManualBreak =
          service === "Curso de Desarrollo Profesional y Cultura";

        return (
          <li key={service} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            {needsManualBreak ? (
              <span className="leading-relaxed">
                Curso de Desarrollo Profesional y
                <br />
                Cultura
              </span>
            ) : (
              <span className="leading-relaxed">{service}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
