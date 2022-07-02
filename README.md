# Web tools to generate subtitles from text with placed time tags
A simple web application that creates SRT or SBV subtitles from time-stamped text. Time-stamped source text can be obtained, for example, by transcribing the video using the oTranscribe web tool. The resulting subtitle structure can be copied and saved to a file with the appropriate extension.
## Instruction
Time-stamped source text (format: XX:XX, XX:XX:XX or X:XX:XX) for example:
```
  01:48:41 This is how it's done.01:48:43
  01:48:46 When people are sittin' on shit that you want,
  01:48:48 you make 'em your enemy.
  01:48:50 Then you're justified in taking it. 01:48:53
```
or:
```
  1:48:41 This is how it's done.1:48:43
  1:48:46 When people are sittin' on shit that you want,
  1:48:48 you make 'em your enemy.
  1:48:50 Then you're justified in taking it. 1:48:53
```
paste in the text field of the form, choose the subtitle format and click the "Generate" button.
The bottom field displays the result, which can be checked

For example, for the SBV format:
```
  1:48:41.000,1:48:43.000
  This is how it's done.

  1:48:46.000,1:48:48.000
  When people are sittin' on shіt that you want,

  1:48:48.000,1:48:50.000
  you make 'em your enemy.
  
  1:48:50.000,1:48:53.000
  Then you're justified in taking it.
```  
Or SRT format:
```
  1
  01:48:41,000 --> 01:48:43,000
  This is how it's done.

  2
  01:48:46,000 --> 01:48:48,000
  When people are sittin' on shit that you want,

  3
  01:48:48,000 --> 01:48:50,000
  you make 'em your enemy.
 
  4
  01:48:50,000 --> 01:48:53,000
  Then you're justified in taking it.
```
Next, you can copy the result to the clipboard by clicking the "Copy" button and save it to a file with the appropriate extension.
