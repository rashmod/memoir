import JSZip from 'jszip';
import Papa from 'papaparse';

export default function handleZipFile(acceptedFiles: File[]) {
  const [file] = acceptedFiles;

  if (!file) return;

  const zip = new JSZip();
  const reader = new FileReader();

  reader.onload = async (event: ProgressEvent<FileReader>) => {
    if (!event.target?.result) return;

    await zip.loadAsync(event.target.result);

    const fileNames: string[] = [];

    async function processFile(zipEntry: JSZip.JSZipObject) {
      const { name } = zipEntry;

      const [, , folder, file] = name.split('/');

      if (!folder || !file) return;

      if (name.endsWith('.json')) {
        const jsonContent = await zipEntry.async('string');
        const parsedJson = JSON.parse(jsonContent);

        console.log('JSON file found:', name);
        console.log(parsedJson);
      } else if (name.endsWith('.csv')) {
        const csvContent = await zipEntry.async('string');
        const parsedCsv = Papa.parse(csvContent, { header: true });

        console.log('CSV file found:', name);
        // remove invalid rows
        console.log(parsedCsv.data.filter((_, i) => !parsedCsv.errors.find((error) => error.row === i)));
      }

      fileNames.push(name);
    }

    const filePromises = Object.values(zip.files).map(processFile);

    await Promise.all(filePromises);

    console.log(fileNames);
  };

  reader.readAsArrayBuffer(file);
}
