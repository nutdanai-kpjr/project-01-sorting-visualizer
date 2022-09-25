import { useContext } from "react";
import { ArrayCtx } from "../../context/arrayContext";
import { COLORS } from "../../styles/color";
import { Item, SortAlgorithm } from "../sorter_abstract";
import { useSorterAudio } from "../sorter_audio";

export const useSelectionSort: () => SortAlgorithm = () => {
  const {
    itemArrayRef,
    swapItem,
    isStopRef,
    stopSort,
    updateColor,
    updateDifferentColor,
  } = useContext(ArrayCtx);

  const { playAudio, playWinAudio } = useSorterAudio();
  const info = {
    name: "Selection Sort",
    description:
      "Selection Sort is a simple sorting algorithm that works by repeatedly finding the minimum element (considering ascending order) from unsorted part and putting it at the beginning. The algorithm maintains two subarrays in a given array. One subarray is always sorted. Selection sort repeatedly selects the minimum element from the unsorted array and places it at the end of the sorted array.",
    complexity: {
      bestCase: "O(n^2)",
      averageCase: "O(n^2)",
      worstCase: "O(n^2)",
    },
  };

  const sort = async () => {
    let arr: Item[] = [...itemArrayRef.current];

    for (let i = 0; i < arr.length; i++) {
      // FInd the smallest element in the unsorted array
      // await updateColor([i], COLORS.COMPARE);
      let min = i;

      for (let j = i + 1; j < arr.length; j++) {
        if (isStopRef.current) {
          return await stopSort();
        }
        arr = [...itemArrayRef.current]; // refetch the array from context to avoid stale state
        let valueNew = { ...arr[j] }.value;
        let valueMin = { ...arr[min] }.value;
        playAudio(valueNew);
        await updateDifferentColor([
          { index: min, color: COLORS.SPECIAL },
          { index: j, color: COLORS.COMPARE },
        ]);
        //Comparing;
        if (valueNew < valueMin) {
          await updateColor([min], COLORS.DEFAULT);
          min = j;
          playWinAudio();
          await updateColor([min], COLORS.SPECIAL);
        } else {
          await updateColor([j, min], COLORS.DEFAULT); // Loser
        }
      }
      // await updateColor([min], COLORS.SORTED);
      await updateColor([min], COLORS.SPECIAL);

      if (min !== i) {
        playWinAudio();
        await swapItem(i, min);
      }

      await updateColor([i], COLORS.SORTED);
    }
  };
  return { sort, info };
};
