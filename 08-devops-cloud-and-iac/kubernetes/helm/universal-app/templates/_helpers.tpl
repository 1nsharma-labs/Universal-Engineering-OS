{{- define "universal-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "universal-app.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "universal-app.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "universal-app.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "universal-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
