"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, LayoutPanelLeft, Palette } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();

  const themeOptions = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Monitor },
  ];

  return (
    <div className='w-full md:w-5xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
        <p className='text-muted-foreground mt-2'>Manage your dashboard preferences and account settings.</p>
      </div>

      <Separator />

      <div className='grid gap-8'>
        {/* Appearance Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2 text-lg font-semibold'>
            <Palette className='w-5 h-5 text-primary' />
            <h2>Appearance</h2>
          </div>
          <Card className='border-muted/50'>
            <CardHeader>
              <CardTitle className='text-base'>Theme Preference</CardTitle>
              <CardDescription>Select how you want the dashboard to look.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-4'>
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:border-primary/50 ${
                        theme === option.value ? "border-primary bg-primary/5" : "border-transparent bg-muted/30"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${theme === option.value ? "text-primary" : "text-muted-foreground"}`} />
                      <span className='text-sm font-medium'>{option.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Layout Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2 text-lg font-semibold'>
            <LayoutPanelLeft className='w-5 h-5 text-primary' />
            <h2>Layout</h2>
          </div>
          <Card className='border-muted/50'>
            <CardHeader>
              <CardTitle className='text-base'>Sidebar Controls</CardTitle>
              <CardDescription>Customize your workspace layout.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between p-4 rounded-xl bg-muted/30'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-medium'>Collapse Sidebar</Label>
                  <p className='text-xs text-muted-foreground'>Toggle the sidebar expanded or collapsed state.</p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className='px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  {state === "expanded" ? "Collapse Now" : "Expand Now"}
                </button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
