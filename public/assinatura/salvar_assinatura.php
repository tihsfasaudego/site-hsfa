<?php
/**
 * Script para salvar assinaturas digitais
 * Recebe dados via POST e salva imagem + arquivo TXT com informações
 */

// Configurações
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Diretório onde serão salvos os arquivos
$diretorio = __DIR__ . '/assinatura/';

// Verificar se o diretório existe, se não, criar
if (!file_exists($diretorio)) {
    mkdir($diretorio, 0755, true);
}

// Verificar se é requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido. Use POST.'
    ]);
    exit;
}

try {
    // Receber dados do POST
    $nome = isset($_POST['nome']) ? trim($_POST['nome']) : '';
    $cargo = isset($_POST['cargo']) ? trim($_POST['cargo']) : '';
    $empresa = isset($_POST['empresa']) ? trim($_POST['empresa']) : '';
    $registro = isset($_POST['registro']) ? trim($_POST['registro']) : '';
    $imagemBase64 = isset($_POST['imagem']) ? $_POST['imagem'] : '';
    
    // Validações
    if (empty($nome)) {
        throw new Exception('Nome é obrigatório');
    }
    
    if (empty($imagemBase64)) {
        throw new Exception('Imagem da assinatura é obrigatória');
    }
    
    // Limpar o nome para usar como nome de arquivo
    $nomeArquivo = preg_replace('/[^a-zA-Z0-9_-]/', '_', $nome);
    $nomeArquivo = strtolower($nomeArquivo);
    
    // Adicionar timestamp para evitar sobrescrita
    $timestamp = date('YmdHis');
    $nomeArquivoFinal = $nomeArquivo . '_' . $timestamp;
    
    // Processar a imagem base64
    // Remover o prefixo "data:image/png;base64,"
    $imagemBase64 = preg_replace('/^data:image\/\w+;base64,/', '', $imagemBase64);
    $imagemDecodificada = base64_decode($imagemBase64);
    
    if ($imagemDecodificada === false) {
        throw new Exception('Erro ao processar a imagem');
    }
    
    // Salvar a imagem PNG
    $caminhoImagem = $diretorio . $nomeArquivoFinal . '.png';
    if (!file_put_contents($caminhoImagem, $imagemDecodificada)) {
        throw new Exception('Erro ao salvar a imagem');
    }
    
    // Criar conteúdo do arquivo TXT
    $conteudoTxt = "==============================================\n";
    $conteudoTxt .= "       REGISTRO DE ASSINATURA DIGITAL\n";
    $conteudoTxt .= "==============================================\n\n";
    $conteudoTxt .= "STATUS: OK\n\n";
    $conteudoTxt .= "DADOS DO REGISTRO:\n";
    $conteudoTxt .= "----------------------------------------------\n";
    $conteudoTxt .= "Nome: " . $nome . "\n";
    $conteudoTxt .= "Cargo: " . ($cargo ? $cargo : 'Não informado') . "\n";
    $conteudoTxt .= "Empresa/Instituição: " . ($empresa ? $empresa : 'Não informado') . "\n";
    $conteudoTxt .= "Número de Registro: " . ($registro ? $registro : 'Não informado') . "\n";
    $conteudoTxt .= "----------------------------------------------\n\n";
    $conteudoTxt .= "INFORMAÇÕES TÉCNICAS:\n";
    $conteudoTxt .= "----------------------------------------------\n";
    $conteudoTxt .= "Data e Hora: " . date('d/m/Y H:i:s') . "\n";
    $conteudoTxt .= "Arquivo de Imagem: " . $nomeArquivoFinal . ".png\n";
    $conteudoTxt .= "IP do Cliente: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $conteudoTxt .= "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n";
    $conteudoTxt .= "----------------------------------------------\n\n";
    $conteudoTxt .= "Assinatura digital salva com sucesso!\n";
    $conteudoTxt .= "==============================================\n";
    
    // Salvar o arquivo TXT
    $caminhoTxt = $diretorio . $nomeArquivoFinal . '.txt';
    if (!file_put_contents($caminhoTxt, $conteudoTxt)) {
        throw new Exception('Erro ao salvar o arquivo de dados');
    }
    
    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Assinatura salva com sucesso!',
        'data' => [
            'nome_arquivo' => $nomeArquivoFinal,
            'arquivo_imagem' => $nomeArquivoFinal . '.png',
            'arquivo_txt' => $nomeArquivoFinal . '.txt',
            'data_hora' => date('d/m/Y H:i:s'),
            'status' => 'OK'
        ]
    ]);
    
} catch (Exception $e) {
    // Resposta de erro
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

