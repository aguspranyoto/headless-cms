'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface MediaManagerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function MediaManager({ open, onClose, onSelect }: MediaManagerProps) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: mediaList } = useQuery({
    queryKey: ['media'],
    queryFn: () =>
      axios
        .get(`${API_URL}/media`, { params: { folder: 'uploads' } })
        .then((r) => r.data),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post(
        `${API_URL}/media/upload?folder=uploads`,
        form,
      );
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      await axios.delete(`${API_URL}/media/${encodeURIComponent(key)}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      await uploadMutation.mutateAsync(file);
      setUploading(false);
    },
    [uploadMutation],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Media Manager</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-4 border-b">
          <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-sm cursor-pointer hover:bg-blue-700">
            {uploading ? 'Uploading...' : 'Upload File'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-3 gap-3">
            {mediaList?.length === 0 && (
              <p className="col-span-3 text-center text-gray-500 py-8">
                No media uploaded yet
              </p>
            )}
            {mediaList?.map((item: any) => (
              <div
                key={item.key}
                className="group relative border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onSelect(item.url)}
              >
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item.url);
                    }}
                    className="hidden group-hover:block px-2 py-1 bg-background text-foreground rounded text-xs border"
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this file?')) {
                        deleteMutation.mutate(item.key);
                      }
                    }}
                    className="hidden group-hover:block px-2 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
