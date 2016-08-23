package main

import (
    // "bufio"
    "fmt"
    "log"
    "io/ioutil"
    // "os"
    "flag"
    "strings"
    "golang.org/x/crypto/bcrypt"
)

func doItForFile(filepath string, dryRun bool) bool {
  
    input, err := ioutil.ReadFile(filepath)
    if err != nil {
            log.Fatalln(err)
    }

    lines := strings.Split(string(input), "\n")

    for i, line := range lines {
            
        if (strings.HasPrefix(line,"password=")) {
          password := strings.TrimPrefix(line,"password=")
          
          hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
          if err != nil {
            log.Fatalln(err)
          }
          lines[i] = "password=" + string(hashedPassword)
        }
    }
    output := strings.Join(lines, "\n")
    
    if (dryRun) {
      fmt.Println(output)
    } else {
      err = ioutil.WriteFile(filepath, []byte(output), 0644)
      if err != nil {
              log.Fatalln(err)
      }
      fmt.Println("Wrote to file.")
    }
  
    return true
}

func main() {
  
  dryRunBoolPtr := flag.Bool("dry-run", false, "Do not actually perform the operation")
  flag.Parse()
  
  if (len(flag.Args()) == 1) {
    doItForFile(flag.Args()[0],*dryRunBoolPtr)
  } else {
    fmt.Println("Usage: jolohash [--dry-run] FILE")
    fmt.Println("")
    fmt.Println("Given a webid user file,")
    fmt.Println("converts webid-proxy user passwords (password=a)")
    fmt.Println("to BCrypt hashes (password=$2a$10$2n45tY...)")
    fmt.Println("")
    fmt.Println("This modifies the file directly.")
    fmt.Println("Use the --dry-run flag to output to the console only.")
  }
}