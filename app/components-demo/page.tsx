"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ProgressBar,
  Modal,
  Stats,
} from "@/src/presentation/components/ui";
import {
  Sword,
  Shield,
  Sparkles,
  Heart,
  Zap,
  Trophy,
  User,
  Package,
} from "lucide-react";

export default function ComponentsDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎮 RPG Component Library
          </h1>
          <p className="text-xl text-gray-400">
            Fantasy-themed UI components for RPG games
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-400">Primary</h3>
              <Button variant="primary" size="sm">
                <Sword className="w-4 h-4" />
                Small Button
              </Button>
              <Button variant="primary">
                <Sword className="w-5 h-5" />
                Medium Button
              </Button>
              <Button variant="primary" size="lg">
                <Sword className="w-6 h-6" />
                Large Button
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-400">Secondary</h3>
              <Button variant="secondary">
                <Shield className="w-5 h-5" />
                Secondary
              </Button>
              <Button variant="action">
                <Sparkles className="w-5 h-5" />
                Action
              </Button>
              <Button variant="danger">
                <Zap className="w-5 h-5" />
                Danger
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-400">Others</h3>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="character" glow>
              <CardHeader>
                <CardTitle>Warrior</CardTitle>
                <CardDescription>Legendary Hero</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-300">Level 50 • Human</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">
                      Fire
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                      Water
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Select
                </Button>
              </CardFooter>
            </Card>

            <Card variant="item">
              <CardHeader>
                <CardTitle>Excalibur</CardTitle>
                <CardDescription>Legendary Sword</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-300">ATK +500 • CRIT +25%</p>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-sm">
                    Legendary
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card variant="quest">
              <CardHeader>
                <CardTitle>Dragon Slayer</CardTitle>
                <CardDescription>Main Quest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Defeat the Ancient Dragon</p>
                <div className="mt-2">
                  <ProgressBar value={75} max={100} type="exp" size="sm" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Progress Bars Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Progress Bars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProgressBar value={850} max={1000} type="hp" />
              <ProgressBar value={450} max={1000} type="hp" />
              <ProgressBar value={150} max={1000} type="hp" />
            </div>
            <div className="space-y-4">
              <ProgressBar value={320} max={500} type="mp" />
              <ProgressBar value={75} max={100} type="stamina" />
              <ProgressBar value={8500} max={10000} type="exp" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stats
              icon={<Heart className="w-full h-full" />}
              label="Total HP"
              value="1,250"
              variant="danger"
            />
            <Stats
              icon={<Zap className="w-full h-full" />}
              label="Total MP"
              value="850"
              variant="info"
            />
            <Stats
              icon={<Trophy className="w-full h-full" />}
              label="Level"
              value="50"
              variant="warning"
            />
            <Stats
              icon={<User className="w-full h-full" />}
              label="Characters"
              value="12"
              variant="primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stats
              icon={<Sword className="w-full h-full" />}
              label="ATK"
              value="450"
              variant="danger"
              size="sm"
            />
            <Stats
              icon={<Shield className="w-full h-full" />}
              label="DEF"
              value="320"
              variant="info"
              size="sm"
            />
            <Stats
              icon={<Sparkles className="w-full h-full" />}
              label="Magic"
              value="580"
              variant="primary"
              size="sm"
            />
          </div>
        </section>

        {/* Modal Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Modal</h2>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Package className="w-5 h-5" />
            Open Inventory Modal
          </Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Inventory"
            size="lg"
          >
            <div className="space-y-4">
              <p className="text-gray-300">
                Your inventory contains various items and equipment.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} variant="item" hover={false}>
                    <CardContent className="p-4">
                      <div className="aspect-square bg-slate-700 rounded-lg mb-2 flex items-center justify-center">
                        <Package className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="text-sm text-white font-semibold">
                        Item {i}
                      </p>
                      <p className="text-xs text-gray-400">x{i * 5}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button variant="primary">Use Selected</Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Element Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-red-600 to-red-500 rounded-lg"></div>
              <p className="text-center text-red-400 font-semibold">Fire</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-cyan-600 to-blue-500 rounded-lg"></div>
              <p className="text-center text-cyan-400 font-semibold">Water</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-lg"></div>
              <p className="text-center text-green-400 font-semibold">Earth</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-teal-600 to-cyan-500 rounded-lg"></div>
              <p className="text-center text-teal-400 font-semibold">Wind</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg"></div>
              <p className="text-center text-amber-400 font-semibold">Light</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg"></div>
              <p className="text-center text-slate-400 font-semibold">Dark</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
