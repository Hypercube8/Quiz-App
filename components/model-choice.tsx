"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { ModelSelector, ModelSelectorContent, ModelSelectorEmpty, ModelSelectorGroup, ModelSelectorInput, ModelSelectorItem, ModelSelectorList, ModelSelectorLogo, ModelSelectorLogoGroup, ModelSelectorName, ModelSelectorTrigger } from "./ai-elements/model-selector";
import { Button } from "./ui/button";
import { CheckIcon } from "lucide-react";
import { gateway } from "ai";
import { getLanguageModels } from "@/lib/actions/get-models";

type Model = {
    id: string;
    name: string;
    description?: string | null | undefined;
    pricing?: {
        input: string;
        output: string;
        cachedInputTokens?: string | undefined;
        cacheCreationInputTokens?: string | undefined;
    } | null | undefined;
    specification: {
        readonly modelId: string;
        readonly provider: string;
        readonly specificationVersion: "v3";
    };
    modelType?: ("video" | "image" | "embedding" | "language" | "reranking") | null | undefined;
}

export default function ModelChoice({ onChoose, selected }: { onChoose: (modelId: string) => void, selected: string }) {
    const [open, setOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState("openai/gpt-4o");
    const [models, setModels] = useState<Model[]>([]);

    useEffect(() => {
        setModels(getLanguageModels());
    }, [])

    const handleModelSelect = useCallback((id: string) => {
        setSelectedModel(id);
        setOpen(false);
        onChoose(id);
    }, [onChoose]);

    const selectedModelData = models.find((model) => model.id === selectedModel);
    const providers = [...new Set(models.map(model => model.specification.provider))];

    return (
        <ModelSelector onOpenChange={setOpen} open={open}>
            <ModelSelectorTrigger asChild>
                <Button variant="outline">
                    {selectedModelData?.specification.provider && (
                        <ModelSelectorLogo provider={selectedModelData?.specification.provider} />
                    )}
                    {selectedModelData?.name && (
                        <ModelSelectorName>{selectedModelData?.name}</ModelSelectorName> 
                    )}  
                </Button>
            </ModelSelectorTrigger>
            <ModelSelectorContent>
                <ModelSelectorInput placeholder="Search models..." />
                <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {
                        providers.map((provider) => (
                            <ModelSelectorGroup heading={provider} key={provider}>
                                {
                                    models
                                        .filter((model) => model.specification.provider === provider)
                                        .map((model) => (
                                            <ModelItem 
                                                key={model.id}
                                                model={model}
                                                selectedModel={selectedModel}
                                                onSelect={handleModelSelect}
                                            />
                                        ))
                                }
                            </ModelSelectorGroup>
                        ))
                    }
                </ModelSelectorList>
            </ModelSelectorContent>
        </ModelSelector>
    )
}

interface ModelItemProps {
    model: Model;
    selectedModel: string;
    onSelect: (id: string) => void;
}

const ModelItem = memo(({ model, selectedModel, onSelect }: ModelItemProps) => {
    const handleSelect = useCallback(
        () => onSelect(model.id),
        [onSelect, model.id]
    );

    return (
        <ModelSelectorItem key={model.id} onSelect={handleSelect} value={model.id}>
            <ModelSelectorLogo provider={model.specification.provider} />
            <ModelSelectorName>{model.name}</ModelSelectorName>
           {selectedModel === model.id ? (
                <CheckIcon />
           ): (
                <div />
           )}
        </ModelSelectorItem>
    )
})

ModelItem.displayName = "ModelItem";