import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Device {
    id: string;
    device_code: string;
    device_name: string;
    is_active: boolean;
}

export interface LatestData {
    soil_moisture: number;
    soil_temperature: number;
    air_temperature: number | null;
    humidity: number | null;
    battery_voltage: number | null;
    wifi_rssi: number;
    status: 'normal' | 'abnormal' | 'warning' | string; // Menggunakan union type agar lebih ketat
    min_soil_moisture: string;
    max_soil_moisture: string;
    min_temperature: string;
    max_temperature: string;
    updated_at: string;
}

export interface TrendDataItem {
    time: string;
    soil_moisture: number;
    soil_temperature: number;
}

export interface TelemetryDataPayload {
    devices: Device[];
    selectedDeviceId: string;
    deviceStatus: 'ONLINE' | 'OFFLINE' | string;
    latestData: LatestData;
    trendData: TrendDataItem[];
}

// Interface Utama untuk API Response Anda
export interface ApiResponseTelemetry {
    status: 'success' | 'error' | string;
    message: string;
    data: TelemetryDataPayload;
}