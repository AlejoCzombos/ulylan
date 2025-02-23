import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/utils/cn";

interface BalanceSearchProps {
  onSearch: (startDate: Date, endDate: Date) => void;
}

export function BalanceSearch({ onSearch }: BalanceSearchProps) {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  // const setDate = (date: Date | undefined) => {
  //   if (!date) return;
  //   const returnDate = new Date(date);
  //   returnDate.setHours(0, 0, 0, 0);
  //   return returnDate;
  // };

  const handleSearch = () => {
    if (startDate && endDate) {
      onSearch(startDate, endDate);
    }
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    setStartDate(start);
    setEndDate(end);
    onSearch(start, end);
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full sm:w-[200px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP", { locale: es }) : <span>Fecha inicial</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full sm:w-[200px] justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP", { locale: es }) : <span>Fecha final</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
        </PopoverContent>
      </Popover>
      <Select onValueChange={(value) => handleQuickSelect(Number(value))}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Período rápido" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 días</SelectItem>
          <SelectItem value="15">Últimos 15 días</SelectItem>
          <SelectItem value="30">Últimos 30 días</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="w-full sm:w-[200px]">
        Buscar
      </Button>
    </div>
  );
}
