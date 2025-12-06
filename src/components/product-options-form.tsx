import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { iProductOptionGroup, iProductOption } from "@/services/products-service";

interface ProductOptionsFormProps {
    optionGroups: iProductOptionGroup[];
    setOptionGroups: (groups: iProductOptionGroup[]) => void;
    disabled?: boolean;
}

export default function ProductOptionsForm({
    optionGroups,
    setOptionGroups,
    disabled,
}: ProductOptionsFormProps) {
    const addGroup = () => {
        setOptionGroups([
            ...optionGroups,
            {
                name: "",
                minSelection: 0,
                maxSelection: 1,
                options: [],
            },
        ]);
    };

    const removeGroup = (groupIndex: number) => {
        const newGroups = [...optionGroups];
        newGroups.splice(groupIndex, 1);
        setOptionGroups(newGroups);
    };

    const updateGroup = (index: number, field: keyof iProductOptionGroup, value: any) => {
        const newGroups = [...optionGroups];
        newGroups[index] = { ...newGroups[index], [field]: value };
        setOptionGroups(newGroups);
    };

    const addOption = (groupIndex: number) => {
        const newGroups = [...optionGroups];
        newGroups[groupIndex].options.push({
            name: "",
            price: 0,
            isAvailable: true,
            description: "",
        });
        setOptionGroups(newGroups);
    };

    const removeOption = (groupIndex: number, optionIndex: number) => {
        const newGroups = [...optionGroups];
        newGroups[groupIndex].options.splice(optionIndex, 1);
        setOptionGroups(newGroups);
    };

    const updateOption = (
        groupIndex: number,
        optionIndex: number,
        field: keyof iProductOption,
        value: any
    ) => {
        const newGroups = [...optionGroups];
        newGroups[groupIndex].options[optionIndex] = {
            ...newGroups[groupIndex].options[optionIndex],
            [field]: value,
        };
        setOptionGroups(newGroups);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Personalização (Ingredientes/Adicionais)</h3>
                <Button
                    type="button"
                    onClick={addGroup}
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    className="text-xs h-8"
                >
                    <Plus className="mr-1 h-3 w-3" />
                    Novo Grupo
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {optionGroups.map((group, groupIndex) => (
                    <AccordionItem
                        key={groupIndex}
                        value={`group-${groupIndex}`}
                        className="border rounded-lg mb-2 px-3"
                    >
                        <div className="flex items-center justify-between py-2">
                            <AccordionTrigger className="hover:no-underline py-0 flex-1">
                                <span className="text-sm font-semibold">
                                    {group.name || `Grupo #${groupIndex + 1}`}
                                </span>
                            </AccordionTrigger>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeGroup(groupIndex);
                                }}
                                disabled={disabled}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <AccordionContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Nome do Grupo</Label>
                                    <Input
                                        value={group.name}
                                        onChange={(e) => updateGroup(groupIndex, "name", e.target.value)}
                                        placeholder="Ex: Sabores, Adicionais"
                                        className="h-8 text-sm"
                                        disabled={disabled}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Mínimo</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={group.minSelection}
                                            onChange={(e) =>
                                                updateGroup(groupIndex, "minSelection", parseInt(e.target.value) || 0)
                                            }
                                            className="h-8 text-sm"
                                            disabled={disabled}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Máximo</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={group.maxSelection}
                                            onChange={(e) =>
                                                updateGroup(groupIndex, "maxSelection", parseInt(e.target.value) || 1)
                                            }
                                            className="h-8 text-sm"
                                            disabled={disabled}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center border-b pb-1">
                                    <Label className="text-xs text-muted-foreground">Opções do Grupo</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => addOption(groupIndex)}
                                        className="h-6 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                        disabled={disabled}
                                    >
                                        <Plus className="mr-1 h-3 w-3" />
                                        Opção
                                    </Button>
                                </div>

                                {group.options.map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-md"
                                    >
                                        <div className="col-span-6">
                                            <Input
                                                value={option.name}
                                                onChange={(e) =>
                                                    updateOption(groupIndex, optionIndex, "name", e.target.value)
                                                }
                                                placeholder="Nome da opção"
                                                className="h-7 text-xs"
                                                disabled={disabled}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <span className="absolute left-2 top-1.5 text-xs text-gray-400">R$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={option.price}
                                                onChange={(e) =>
                                                    updateOption(
                                                        groupIndex,
                                                        optionIndex,
                                                        "price",
                                                        parseFloat(e.target.value)
                                                    )
                                                }
                                                className="h-7 text-xs pl-6"
                                                disabled={disabled}
                                            />
                                        </div>

                                        <div className="col-span-2 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-400 hover:text-red-600"
                                                onClick={() => removeOption(groupIndex, optionIndex)}
                                                disabled={disabled}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {group.options.length === 0 && (
                                    <p className="text-xs text-center text-gray-400 py-2 italic">Nenhuma opção adicionada</p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                {optionGroups.length === 0 && (
                    <div className="text-center py-4 border border-dashed rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500">Este produto não possui personalizações.</p>
                        <p className="text-xs text-gray-400">Clique em "Novo Grupo" para adicionar.</p>
                    </div>
                )}
            </Accordion>
        </div>
    );
}
