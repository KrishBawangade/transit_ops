"use client";

import React, { memo } from "react";
import { Eye, FileUp, Trash2 } from "lucide-react";
import { VehicleAssignment } from "../types";
import { AssignmentStatusBadge } from "./AssignmentStatusBadge";

interface VehicleAssignmentTableProps {
  assignments: VehicleAssignment[];
  onView: (assignment: VehicleAssignment) => void;
  onReassign: (assignment: VehicleAssignment) => void;
  onUnassign: (assignment: VehicleAssignment) => void;
}

export const VehicleAssignmentTable = memo(function VehicleAssignmentTable({
  assignments,
  onView,
  onReassign,
  onUnassign
}: VehicleAssignmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50 border-b border-border-app text-xs font-semibold text-text-secondary uppercase tracking-wider select-none">
            <th className="p-4">Vehicle</th>
            <th className="p-4">Reg Number</th>
            <th className="p-4">Assigned Driver</th>
            <th className="p-4">Driver ID</th>
            <th className="p-4">Assignment Date</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {assignments.map((asg) => (
            <tr key={asg.id} className="hover:bg-primary-light/20 transition-colors">
              <td className="p-4 font-medium text-text-primary">
                {asg.vehicleName}
              </td>
              <td className="p-4 font-mono font-semibold text-xs text-primary">
                {asg.registrationNumber}
              </td>
              <td className="p-4 text-text-primary font-medium">
                {asg.driverName}
              </td>
              <td className="p-4 font-mono text-xs text-text-secondary">
                {asg.driverId}
              </td>
              <td className="p-4 text-xs font-mono text-text-secondary">
                {asg.assignmentDate}
              </td>
              <td className="p-4 text-center">
                <AssignmentStatusBadge status={asg.status} />
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2 text-xs font-semibold select-none">
                  <button
                    onClick={() => onView(asg)}
                    className="inline-flex items-center gap-1 text-primary hover:underline hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                  <span className="text-divider-app text-[10px]" aria-hidden="true">|</span>
                  <button
                    onClick={() => onReassign(asg)}
                    disabled={asg.status === "Inactive"}
                    className="inline-flex items-center gap-1 text-secondary hover:underline hover:text-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FileUp size={13} />
                    <span>Reassign</span>
                  </button>
                  <span className="text-divider-app text-[10px]" aria-hidden="true">|</span>
                  <button
                    onClick={() => onUnassign(asg)}
                    disabled={asg.status === "Available"}
                    className="inline-flex items-center gap-1 text-error hover:underline hover:text-error/80 transition-colors focus:outline-none focus:ring-2 focus:ring-error/20 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Unassign</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
