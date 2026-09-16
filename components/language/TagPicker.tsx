'use client';

import {
  useCreateSituationTag,
  useSituationTags,
} from '@/entities/language/hooks';
import { useState } from 'react';

interface TagPickerProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagPicker({ selectedTagIds, onChange }: TagPickerProps) {
  const [newTagInput, setNewTagInput] = useState('');
  const { data: tags } = useSituationTags();
  const createTag = useCreateSituationTag();

  const toggleTag = (tagId: string) => {
    onChange(
      selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((t) => t !== tagId)
        : [...selectedTagIds, tagId],
    );
  };

  const handleCreateNewTag = async () => {
    const name = newTagInput.trim();
    if (!name) return;
    const existing = tags?.find((t) => t.name === name);
    if (existing) {
      if (!selectedTagIds.includes(existing.id)) toggleTag(existing.id);
    } else {
      const created = await createTag.mutateAsync(name);
      onChange([...selectedTagIds, created.id]);
    }
    setNewTagInput('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags?.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className={`text-[11px] px-2.5 py-1 rounded-full border ${
              selectedTagIds.includes(tag.id)
                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={newTagInput}
        onChange={(e) => setNewTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateNewTag();
          }
        }}
        placeholder="새 태그 입력 후 Enter"
        className="w-full text-[13px] border rounded-md p-1.5"
      />
    </div>
  );
}
