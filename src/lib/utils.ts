import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda en euros con el formato: 3.500€
 * - Usa punto como separador de miles
 * - Símbolo € al final sin espacio
 */
export function formatEuro(value: number): string {
  const parts = Math.round(value).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${parts[0]}€`;
}
