import { useState, useCallback } from 'react';
import { AIAPI } from '../api';

export function useAI() {
    const [isTraining, setIsTraining] = useState(false);
    const [currentModel, setCurrentModel] = useState(null);
    const [models, setModels] = useState([]);

    const loadModels = useCallback(async (datasetId) => {
        try {
            const res = await AIAPI.getModelsByDataset(datasetId);
            setModels(res.data || []);
            return res.data;
        } catch (e) {
            console.error('Failed to load models:', e);
            return [];
        }
    }, []);

    const pollStatus = useCallback(async (modelId, datasetId) => {
        const interval = setInterval(async () => {
            try {
                const res = await AIAPI.getModelStatus(modelId);
                setCurrentModel(res.data);

                if (res.data.status === 'COMPLETED' || res.data.status === 'FAILED') {
                    clearInterval(interval);
                    if (datasetId) loadModels(datasetId);
                }
            } catch (e) {
                console.error('Status poll failed:', e);
                clearInterval(interval);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [loadModels]);

    const trainModel = async (datasetId, algorithm, hyperparameters) => {
        setIsTraining(true);
        try {
            const res = await AIAPI.trainModel({
                datasetId,
                algorithm,
                hyperparameters
            });
            setCurrentModel(res.data);
            pollStatus(res.data.id, datasetId);
            return res.data;
        } catch (e) {
            throw e;
        } finally {
            setIsTraining(false);
        }
    };

    const generateData = async (modelId, count, anomalyJson = null) => {
        try {
            const res = await AIAPI.generateData(modelId, { count, anomalyJson });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `synthetic_export_${modelId}_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            throw e;
        }
    };

    return {
        isTraining,
        currentModel,
        models,
        trainModel,
        generateData,
        loadModels
    };
}
