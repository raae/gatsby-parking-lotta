import React from "react";
import renderer from "react-test-renderer";

import LotApp, {
  findAvailableFloorToPark,
  findPossibleFloorToLeave,
  parkEnabled,
  leaveEnabled,
} from "./lot-app";

// Some tests, not all functions are tested yet
describe("LotApp", () => {
  it("renders correctly", () => {
    const testRenderer = renderer.create(
      <LotApp
        floors={[
          { name: "Test Floor", spaces: 4 },
          { name: "Test Floor", spaces: 5 },
        ]}
      />
    );
    const testInstance = testRenderer.root;
    expect(testRenderer.toJSON()).toMatchSnapshot();
    expect(testInstance.findByType("p").children.join("")).toEqual(
      "9 out of 9 available"
    );
  });

  it("findAvailableFloorToPark", () => {
    const state = {
      floors: [
        { spaces: 10, available: 0 },
        { spaces: 3, available: 3 },
        { spaces: 16, available: 20 },
      ],
    };

    expect(findAvailableFloorToPark(state)).not.toEqual(0);
  });

  it("findAvailableFloorToLeave", () => {
    const state = {
      floors: [
        { spaces: 10, available: 0 },
        { spaces: 5, available: 3 },
        { spaces: 16, available: 16 },
      ],
    };

    expect(findPossibleFloorToLeave(state)).not.toEqual(2);
  });

  describe("parkEnabled", () => {
    it("total for lot", () => {
      expect(
        parkEnabled({
          totalAvailable: 6,
        })
      ).toEqual(true);

      expect(
        parkEnabled({
          totalAvailable: 0,
        })
      ).toEqual(false);

      expect(
        parkEnabled({
          totalAvailable: -4,
        })
      ).toEqual(false);
    });

    it("per floor", () => {
      const state = {
        floors: [
          { available: 0 },
          { available: 3 },
          { available: 20 },
          { available: -1 },
        ],
      };

      expect(parkEnabled(state, 0)).toEqual(false);
      expect(parkEnabled(state, 1)).toEqual(true);
      expect(parkEnabled(state, 2)).toEqual(true);
      expect(parkEnabled(state, 3)).toEqual(false);
    });
  });

  describe("leaveEnabled", () => {
    it("total for lot", () => {
      expect(
        leaveEnabled({
          totalSpaces: 10,
          totalAvailable: 5,
        })
      ).toEqual(true);

      expect(
        leaveEnabled({
          totalSpaces: 10,
          totalAvailable: 10,
        })
      ).toEqual(false);

      expect(
        leaveEnabled({
          totalSpaces: 10,
          totalAvailable: 15,
        })
      ).toEqual(false);

      expect(
        leaveEnabled({
          totalSpaces: 10,
          totalAvailable: -4,
        })
      ).toEqual(true);
    });

    it("per floor", () => {
      const state = {
        floors: [
          { spaces: 10, available: 0 },
          { spaces: 3, available: 3 },
          { spaces: 16, available: 20 },
          { spaces: 5, available: -1 },
        ],
      };

      expect(leaveEnabled(state, 0)).toEqual(true);
      expect(leaveEnabled(state, 1)).toEqual(false);
      expect(leaveEnabled(state, 2)).toEqual(false);
      expect(leaveEnabled(state, 3)).toEqual(true);
    });
  });
});
