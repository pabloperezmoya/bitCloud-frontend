import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Stack,
  Text,
  Input,
  useBreakpointValue,
  ResponsiveValue,
} from "@chakra-ui/react";
import { UserButton } from "@clerk/clerk-react";

import React, { useEffect, useState } from "react";
import { ActionTypes } from "../../reducer";

type Props = {
  state: any;
  dispatch: any;
};

export const Header: React.FC<Props> = ({ dispatch }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (input.length == 0) {
      dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: null });
    }
    if (input.length > 0) {
      dispatch({
        type: ActionTypes.SET_SEARCH_QUERY,
        payload: input.toLocaleLowerCase(),
      });
    }
  }, [input]);

  const columnSearch = useBreakpointValue({
    base: {
      start: 3,
      end: 4,
    },
    sm: {
      start: 3,
      end: 4,
    },
    md: {
      start: 4,
      end: 8,
    },
  }) as ResponsiveValue<any>;

  const showFullSearch = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
  }) as ResponsiveValue<any>;

  return (
    <SimpleGrid marginTop={3} marginBottom={5} columns={[3, 3, 10]}>
      <Box w={80}>
        <Text fontSize={"2xl"} fontWeight={"bold"} fontFamily={"mono"}>
          bitCloud🌧️+⚡
        </Text>
      </Box>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gridColumnStart={columnSearch.start}
        gridColumnEnd={columnSearch.end}
        justifySelf={"center"}
        w={"90%"}
      >
        <InputGroup size={"sm"}>
          {showFullSearch == true ? (
            <InputLeftAddon children={<Search2Icon />} border={0} />
          ) : (
            <Button
              w={"auto"}
              color={"grey"}
              borderRadius={0}
              children={<Search2Icon />}
            />
          )}

          {showFullSearch && (
            <Input
              onChange={(e) => setInput(e.target.value)}
              color={"grey"}
              borderRadius={0}
              w={"100%"}
            />
          )}
        </InputGroup>
      </Stack>

      <Box justifySelf={"end"} gridColumnStart={10}>
        <UserButton />
      </Box>
    </SimpleGrid>
  );
};
