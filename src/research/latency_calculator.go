package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Please provide input file name")
		return
	}

	fileName := os.Args[1]

	timesTable, err := os.Open(fileName)
	if err != nil {
		log.Fatal(err)
	}

	defer timesTable.Close()

	scanner := bufio.NewScanner(timesTable)

	resultFile, err := os.Create(resultName(fileName))
	if err != nil {
		log.Fatal(err)
	}

	defer resultFile.Close()

	for scanner.Scan() {
		line := scanner.Text()
		words := strings.Fields(line)

		if words[0] == "HEAD" {
			resultFile.WriteString(words[1] + "\n")
			continue
		}

		if words[0] == "" {
			continue
		}

		timeFrom, err := strconv.ParseInt(words[0], 10, 64)
		if err != nil {
			log.Fatal(err)
		}

		timeAfter, err := strconv.ParseInt(words[1], 10, 64)
		if err != nil {
			log.Fatal(err)
		}

		resultFile.WriteString(fmt.Sprintf("%d\n", timeAfter-timeFrom))
	}
}

func resultName(originalFilename string) string {
	return fmt.Sprintf("calculated-%s", originalFilename)
}
