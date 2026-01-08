import { useState, useEffect, useCallback } from 'react';
import { DatasetAPI } from '../api';

export function useDatasets(projectId) {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadDatasets = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await DatasetAPI.getByProject(projectId);
            setDatasets(res.data || []);
        } catch (err) {
            console.error('Failed to load datasets:', err);
            setError(err.message || 'Failed to fetch datasets');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const uploadDataset = async (file, pId = projectId) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', pId);
        try {
            const res = await DatasetAPI.upload(formData);
            await loadDatasets();
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteDataset = async (id) => {
        try {
            await DatasetAPI.delete(id);
            await loadDatasets();
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        loadDatasets();
    }, [loadDatasets]);

    return {
        datasets,
        loading,
        error,
        refresh: loadDatasets,
        uploadDataset,
        deleteDataset
    };
}
