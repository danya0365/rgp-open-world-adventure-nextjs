import { mockLocations, buildLocationTree, getLocationPath } from "@/src/data/mock";
import { Location } from "@/src/domain/types/location.types";

/**
 * World View Model
 */
export interface WorldViewModel {
  locations: Location[];
  rootLocations: Location[];
  totalLocations: number;
  discoveredCount: number;
  continentCount: number;
  cityCount: number;
}

/**
 * Location Detail View Model
 */
export interface LocationDetailViewModel {
  location: Location;
  path: Location[];
  children: Location[];
  connections: Location[];
  isDiscovered: boolean;
}

/**
 * World Presenter
 * Handles business logic for world map navigation using mock data
 */
export class WorldPresenter {
  /**
   * Get view model for world map page
   */
  async getViewModel(): Promise<WorldViewModel> {
    try {
      const locationTree = buildLocationTree(mockLocations);
      const rootLocations = locationTree.filter((loc) => !loc.parentId);
      
      const continents = mockLocations.filter((loc) => loc.type === "continent");
      const cities = mockLocations.filter((loc) => loc.type === "city");
      const discovered = mockLocations.filter((loc) => loc.isDiscoverable);

      return {
        locations: mockLocations,
        rootLocations,
        totalLocations: mockLocations.length,
        discoveredCount: discovered.length,
        continentCount: continents.length,
        cityCount: cities.length,
      };
    } catch (error) {
      console.error("Error getting world view model:", error);
      throw error;
    }
  }

  /**
   * Get location detail view model
   */
  async getLocationDetail(locationId: string): Promise<LocationDetailViewModel> {
    try {
      const location = mockLocations.find((loc) => loc.id === locationId);
      
      if (!location) {
        throw new Error(`Location not found: ${locationId}`);
      }

      const path = getLocationPath(locationId);
      const children = mockLocations.filter((loc) => loc.parentId === locationId);
      const connections: Location[] = []; // TODO: Implement connections from metadata

      return {
        location,
        path,
        children,
        connections,
        isDiscovered: location.isDiscoverable,
      };
    } catch (error) {
      console.error("Error getting location detail:", error);
      throw error;
    }
  }

  /**
   * Generate metadata for world page
   */
  async generateMetadata() {
    return {
      title: "แผนที่โลก | RPG Open World Adventure",
      description: "สำรวจโลกแฟนตาซีกว้างใหญ่ พร้อมสถานที่มากกว่า 20+ แห่ง",
      keywords: "world map, locations, exploration, rpg, adventure",
    };
  }

  /**
   * Generate metadata for location detail page
   */
  async generateLocationMetadata(locationId: string) {
    try {
      const location = mockLocations.find((loc) => loc.id === locationId);
      
      if (!location) {
        return {
          title: "สถานที่ | RPG Open World Adventure",
          description: "สำรวจสถานที่ในโลกแฟนตาซี",
        };
      }

      return {
        title: `${location.name} | RPG Open World Adventure`,
        description: location.description,
        keywords: `${location.name}, ${location.type}, location, rpg`,
      };
    } catch (error) {
      console.error("Error generating location metadata:", error);
      throw error;
    }
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: string): Promise<Location | undefined> {
    try {
      return mockLocations.find((loc) => loc.id === id);
    } catch (error) {
      console.error("Error getting location by ID:", error);
      throw error;
    }
  }

  /**
   * Get children locations
   */
  async getChildrenLocations(parentId: string): Promise<Location[]> {
    try {
      return mockLocations.filter((loc) => loc.parentId === parentId);
    } catch (error) {
      console.error("Error getting children locations:", error);
      throw error;
    }
  }

  /**
   * Get root locations (no parent)
   */
  async getRootLocations(): Promise<Location[]> {
    try {
      return mockLocations.filter((loc) => !loc.parentId);
    } catch (error) {
      console.error("Error getting root locations:", error);
      throw error;
    }
  }
}

/**
 * Factory for creating WorldPresenter instances
 */
export class WorldPresenterFactory {
  /**
   * Create presenter for server-side rendering
   */
  static async createServer(): Promise<WorldPresenter> {
    return new WorldPresenter();
  }

  /**
   * Create presenter for client-side
   */
  static async createClient(): Promise<WorldPresenter> {
    return new WorldPresenter();
  }
}
