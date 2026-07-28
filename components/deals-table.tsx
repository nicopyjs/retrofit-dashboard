"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cleanTitle, fmtDeal } from "@/lib/deals";
import type { NormalizedDeal } from "@/lib/deals";

function DealRows({ deals }: { deals: NormalizedDeal[] }) {
  const sorted = [...deals].sort((a, b) => b.value - a.value);
  return (
    <TableBody>
      {sorted.map((d) => (
        <TableRow key={d.id} className="border-border">
          <TableCell className="max-w-[200px] truncate p-0 py-2.5 text-xs whitespace-nowrap">
            {cleanTitle(d.title)}
          </TableCell>
          <TableCell className="p-0 py-2.5 font-mono text-[11px] text-muted-foreground">
            {d.owner_name || "—"}
          </TableCell>
          <TableCell className="p-0 py-2.5 text-right font-mono text-[13px] font-medium text-foreground">
            {fmtDeal(d.rawValue, d.currency)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export function DealsTable({ adj, perd }: { adj: NormalizedDeal[]; perd: NormalizedDeal[] }) {
  return (
    <Card className="rounded-xl border-0 p-5.5 ring-1 ring-border">
      <Tabs defaultValue="adj">
        <div className="mb-4.5 flex items-center justify-between">
          <div className="font-display text-[13px] font-semibold tracking-wider text-muted-foreground uppercase">
            Deals cerrados
          </div>
          <TabsList>
            <TabsTrigger value="adj" className="font-mono text-[10px] uppercase">
              Adjudicados
            </TabsTrigger>
            <TabsTrigger value="perd" className="font-mono text-[10px] uppercase">
              Perdidos
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="adj">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-auto p-0 pb-2.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Proyecto
                </TableHead>
                <TableHead className="h-auto p-0 pb-2.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Ejecutivo
                </TableHead>
                <TableHead className="h-auto p-0 pb-2.5 text-right font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Valor
                </TableHead>
              </TableRow>
            </TableHeader>
            <DealRows deals={adj} />
          </Table>
        </TabsContent>
        <TabsContent value="perd">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-auto p-0 pb-2.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Proyecto
                </TableHead>
                <TableHead className="h-auto p-0 pb-2.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Ejecutivo
                </TableHead>
                <TableHead className="h-auto p-0 pb-2.5 text-right font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Valor
                </TableHead>
              </TableRow>
            </TableHeader>
            <DealRows deals={perd} />
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
