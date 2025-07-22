'use client';

import { useState } from 'react';
import { RestaurantChange, FieldChange } from '../../types/restaurant';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatRelativeTime } from '../../lib/utils';

interface ChangeReviewPanelProps {
  change: RestaurantChange;
  onApprove: (changeId: string, notes?: string) => void;
  onReject: (changeId: string, notes?: string) => void;
  loading?: boolean;
}

/**
 * Change review panel showing side-by-side comparison of changes
 */
export function ChangeReviewPanel({
  change,
  onApprove,
  onReject,
  loading = false
}: ChangeReviewPanelProps) {
  const [notes, setNotes] = useState('');

  const handleApprove = () => {
    onApprove(change.id, notes.trim() || undefined);
  };

  const handleReject = () => {
    onReject(change.id, notes.trim() || undefined);
  };

  const renderFieldValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderChangeDiff = (fieldChange: FieldChange) => {
    const { field, oldValue, newValue, changeType } = fieldChange;

    return (
      <div key={field} className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <span className={`
            px-2 py-1 text-xs rounded-full
            ${changeType === 'add' ? 'bg-green-100 text-green-800' : ''}
            ${changeType === 'update' ? 'bg-blue-100 text-blue-800' : ''}
            ${changeType === 'remove' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {changeType}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
            <div className="text-xs font-medium text-red-700 mb-1">Current Value</div>
            <div className="text-sm text-red-800 break-words">
              {changeType === 'add' ? '(empty)' : renderFieldValue(oldValue)}
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
            <div className="text-xs font-medium text-green-700 mb-1">Proposed Change</div>
            <div className="text-sm text-green-800 break-words">
              {changeType === 'remove' ? '(removed)' : renderFieldValue(newValue)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Review Changes for {change.restaurantName}
          </h3>
          <p className="text-sm text-gray-600">
            Submitted by {change.analystName} {formatRelativeTime(change.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Change ID</div>
          <div className="font-mono text-xs text-gray-500">{change.id}</div>
        </div>
      </div>

      {/* Changes */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Changes to Review</h4>
        {change.changes.map(renderChangeDiff)}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Review Notes (Optional)
        </label>
        <Input
          id="notes"
          placeholder="Add any notes about this change..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="destructive"
          onClick={handleReject}
          loading={loading}
        >
          Reject Changes
        </Button>

        <Button
          onClick={handleApprove}
          loading={loading}
        >
          Approve Changes
        </Button>
      </div>
    </div>
  );
}