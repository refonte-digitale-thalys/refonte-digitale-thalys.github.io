Sub ApplyTableStyle()
Dim t As Table
For Each t In ActiveDocument.Tables
t.Style = "Grille de tableau claire"
Next
End Sub