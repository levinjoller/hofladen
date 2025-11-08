import { Component } from "vue";

export interface ToolbarAction {
  label: string;
  icon: string | Component;
  handler: () => void;
}
